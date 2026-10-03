import { useMemo, useState } from 'react';
import { Alert, Button, Dialog, useToast } from '../../../shared/components/ui';
import type { GeneratedFile, GeneratorConfig, ModuleRegistration } from '../types';
import { definitionToConfig } from '../engine/fromDefinition';
import { GeneratorConfigError, generateModule } from '../engine/moduleGenerator';
import { buildRegistration } from '../engine/registration';
import {
  WriteConflictError,
  WriteEndpointUnavailableError,
  writeModuleToRepo,
} from '../api/writeToRepo';
import type { ModuleDefinition } from '../definitions';
import OutputPanel from './OutputPanel';

interface GenerateDialogProps {
  def: ModuleDefinition;
  onClose: () => void;
}

type WriteStatus =
  | { state: 'idle' }
  | { state: 'writing' }
  | { state: 'written'; count: number; registered: { routes: number; navigation: boolean } | null }
  | { state: 'conflict'; existing: string[] }
  | { state: 'failed'; message: string };

function GenerateDialog({ def, onClose }: GenerateDialogProps) {
  const { showToast } = useToast();
  const [writeStatus, setWriteStatus] = useState<WriteStatus>({ state: 'idle' });

  const generated = useMemo((): {
    files: GeneratedFile[];
    config: GeneratorConfig;
    registration: ModuleRegistration;
  } | { error: string } => {
    try {
      const config = definitionToConfig(def);
      return {
        files: generateModule(config),
        config,
        registration: buildRegistration(config),
      };
    } catch (err) {
      return {
        error:
          err instanceof GeneratorConfigError
            ? err.issues.map((issue) => `${issue.path}: ${issue.message}`).join('; ')
            : 'Gagal men-generate modul.',
      };
    }
  }, [def]);

  async function writeFiles(
    files: GeneratedFile[],
    overwrite: boolean,
    registration: ModuleRegistration,
  ): Promise<void> {
    setWriteStatus({ state: 'writing' });
    try {
      const result = await writeModuleToRepo(files, overwrite, registration);
      setWriteStatus({
        state: 'written',
        count: result.written.length,
        registered: result.registered,
      });
      const reg = result.registered;
      showToast({
        variant: 'success',
        message:
          reg && (reg.routes > 0 || reg.navigation)
            ? `${result.written.length} file ditulis ke repo. Routes + navigasi terdaftar.`
            : `${result.written.length} file ditulis ke repo.`,
      });
    } catch (err) {
      if (err instanceof WriteConflictError) {
        setWriteStatus({ state: 'conflict', existing: err.existing });
      } else if (err instanceof WriteEndpointUnavailableError) {
        setWriteStatus({ state: 'failed', message: err.message });
      } else {
        setWriteStatus({
          state: 'failed',
          message: err instanceof Error ? err.message : 'Gagal menulis ke repo.',
        });
      }
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title={`Generate ke repo: ${def.label}`}
      maxWidth="2xl"
      testId="generate-dialog"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Tutup
          </Button>
          {'files' in generated && (
            <Button
              disabled={writeStatus.state === 'writing'}
              onClick={() => void writeFiles(generated.files, false, generated.registration)}
            >
              {writeStatus.state === 'writing'
                ? 'Menulis…'
                : `Tulis ke repo (${generated.files.length} file)`}
            </Button>
          )}
        </>
      }
    >
      <div className="flex flex-col stack-gap">
        {'error' in generated ? (
          <Alert variant="error" message={generated.error} />
        ) : (
          <>
            {writeStatus.state === 'writing' && (
              <Alert variant="info" message="Menulis file ke repo…" />
            )}
            {writeStatus.state === 'written' && (
              <Alert
                variant="success"
                message={`${writeStatus.count} file sudah ditulis ke repo.${
                  writeStatus.registered &&
                  (writeStatus.registered.routes > 0 || writeStatus.registered.navigation)
                    ? ` ${writeStatus.registered.routes} route(s) + navigasi terdaftar otomatis — modul langsung bisa dibuka.`
                    : ' Routes + navigasi sudah terdaftar sebelumnya.'
                }`}
              />
            )}
            {writeStatus.state === 'failed' && (
              <Alert
                variant="warning"
                message={`${writeStatus.message} File tetap bisa disalin/download manual di bawah.`}
              />
            )}
            <p className="text-xs text-muted-foreground">
              Tulis ke repo hanya jalan di `npm run dev`. Modul statis menutupi versi dinamis di
              route yang sama dan memakai data mock-nya sendiri.
            </p>
            <OutputPanel files={generated.files} config={generated.config} onBack={onClose} />
          </>
        )}
      </div>
      <Dialog
        testId="generate-overwrite-dialog"
        open={writeStatus.state === 'conflict'}
        onClose={() => setWriteStatus({ state: 'idle' })}
        title="File sudah ada"
        maxWidth="md"
        closeOnEscape
        closeOnBackdropClick
        footer={
          <>
            <Button variant="secondary" onClick={() => setWriteStatus({ state: 'idle' })}>
              Batal
            </Button>
            {'files' in generated && (
              <Button
                onClick={() => void writeFiles(generated.files, true, generated.registration)}
              >
                Timpa semua
              </Button>
            )}
          </>
        }
      >
        <p className="text-sm text-foreground">
          {writeStatus.state === 'conflict' ? writeStatus.existing.length : 0} file sudah ada di
          repo dan akan ditimpa:
        </p>
        {writeStatus.state === 'conflict' && (
          <ul className="mt-2 max-h-48 list-disc overflow-y-auto pl-5 font-mono text-xs text-foreground">
            {writeStatus.existing.map((path) => (
              <li key={path}>{path}</li>
            ))}
          </ul>
        )}
      </Dialog>
    </Dialog>
  );
}

export default GenerateDialog;
