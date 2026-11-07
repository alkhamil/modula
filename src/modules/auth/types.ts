export type AppRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'PRESALES'
  | 'BPA'
  | 'UI_UX'
  | 'DEVELOPER'
  | 'QA';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  status: 'ACTIVE' | 'INACTIVE';
  permissions: string[];
  createdAt: string;
  lastLogin?: string | null;
}

export interface DemoSeedAccount {
  name: string;
  email: string;
  role: AppRole;
  description: string;
}

export const SEED_ACCOUNTS: DemoSeedAccount[] = [
  {
    name: 'Super Administrator',
    email: 'superadmin@modula.io',
    role: 'SUPER_ADMIN',
    description: 'Akses penuh ke seluruh sistem & konfigurasi',
  },
  {
    name: 'Administrator',
    email: 'admin@modula.io',
    role: 'ADMIN',
    description: 'Kelola akun internal, user management, & template',
  },
  {
    name: 'Presales Consultant',
    email: 'presales@modula.io',
    role: 'PRESALES',
    description: 'Buat, sesuaikan & presentasikan mockup ke klien',
  },
  {
    name: 'Business Process Analyst',
    email: 'bpa@modula.io',
    role: 'BPA',
    description: 'Visualisasi alur bisnis CMS dari dokumen BRD',
  },
  {
    name: 'UI/UX Specialist',
    email: 'uiux@modula.io',
    role: 'UI_UX',
    description: 'Standarisasi komponen WDS & desain antarmuka',
  },
  {
    name: 'Frontend Developer',
    email: 'developer@modula.io',
    role: 'DEVELOPER',
    description: 'Export source code React & JSON backend contract',
  },
  {
    name: 'Quality Assurance',
    email: 'qa@modula.io',
    role: 'QA',
    description: 'Verifikasi validasi & skenario pengujian umum',
  },
];
