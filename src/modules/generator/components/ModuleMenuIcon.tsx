import { WdsIcon } from '../../../shared/components/icons';
import { isWdsIcon, WDS_ICON_NAMES } from '../../../shared/components/icons/names';

const FALLBACK_NAME = 'Database';

/** Daftar nama ikon WDS yang bisa dipilih (diurut abjad). */
export const MENU_ICON_NAMES: readonly string[] = WDS_ICON_NAMES;

/** Cek nama ikon dikenal (untuk sanitasi sebelum emit kode). */
export const isKnownMenuIcon = isWdsIcon;

interface ModuleMenuIconProps {
  name?: string | null;
  className?: string;
}

/** Ikon menu modul dari nama WDS; fallback `Database` bila tak dikenal. */
function ModuleMenuIcon({ name, className }: ModuleMenuIconProps) {
  return <WdsIcon name={name} fallback={FALLBACK_NAME} className={className} />;
}

export default ModuleMenuIcon;
export { FALLBACK_NAME as MODULE_MENU_ICON_FALLBACK };
