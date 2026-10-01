import { useCallback } from 'react';
import { useFormState } from 'react-hook-form';
import Button from './Button';
import Dialog from './Dialog';
import { useConfirmNavigation } from '../../hooks';
import { ConfirmInfoIcon } from '../icons';

interface NavigationGuardProps {
  submitted: boolean;
  /** Blokir navigasi walau form belum berubah (mis. sudah ada polis terpilih). */
  force?: boolean;
  testId?: string;
  title?: string;
  description?: string;
}

function NavigationGuard({
  submitted,
  force = false,
  testId,
  title = 'Are you sure you want to leave this page?',
  description = 'All unsaved changes will be deleted. Continue?',
}: NavigationGuardProps) {
  const { isDirty } = useFormState();
  const blocker = useConfirmNavigation((isDirty || force) && !submitted);

  const handleProceed = useCallback(() => {
    if (blocker.state === 'blocked') blocker.proceed();
  }, [blocker]);

  const handleReset = useCallback(() => {
    if (blocker.state === 'blocked') blocker.reset();
  }, [blocker]);

  return (
    <Dialog
      testId={testId}
      open={blocker.state === 'blocked'}
      maxWidth="md"
      onClose={handleReset}
      closeOnEscape={false}
      hideCloseButton
    >
      <div className="flex items-start gap-4">
        <ConfirmInfoIcon className="h-12 w-12 shrink-0" />
        <div>
          <p className="text-base font-medium text-foreground">{title}</p>
          <p className="mt-1 text-sm font-normal text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" className="w-25" onClick={handleReset}>
          Cancel
        </Button>
        <Button className="w-25" onClick={handleProceed}>
          Continue
        </Button>
      </div>
    </Dialog>
  );
}

export default NavigationGuard;
