import type { TemplateContext } from '../../engine/context';
import { buildRegistration } from '../../engine/registration';

export function moduleIndexTemplate(ctx: TemplateContext): string {
  const { names, features } = ctx;
  const lines: string[] = [];
  if (features.list)
    lines.push(`export { default as ${names.entity}ListPage } from './pages/${names.entity}ListPage';`);
  if (features.create)
    lines.push(
      `export { default as ${names.entity}CreatePage } from './pages/${names.entity}CreatePage';`,
    );
  if (features.detail)
    lines.push(`export { default as ${names.entity}ViewPage } from './pages/${names.entity}ViewPage';`);
  if (features.edit)
    lines.push(`export { default as ${names.entity}EditPage } from './pages/${names.entity}EditPage';`);
  return `${lines.join('\n')}\n`;
}

export function integrationTemplate(ctx: TemplateContext): string {
  const { names, permissions, features } = ctx;
  const reg = buildRegistration(ctx.config);
  const routes = reg.routes.map((route) => route.code).join('\n');

  return `# Integrasi modul ${names.entity}

File ini dibuat otomatis oleh generator. Hapus setelah modul terintegrasi.

## 1. Salin folder modul (otomatis)

Folder \`${names.dir}\` sudah ditulis langsung ke repo oleh dev-server saat klik Generate.
Jika generate di luar dev-server (copy/download manual), salin folder tersebut ke repo.

## 2. Routes (otomatis)

Sudah didaftarkan otomatis di \`src/app/router.tsx\` saat generate via dev-server.
Referensi manual bila perlu:

\`\`\`tsx
${reg.importBlock}

// di dalam children AppShell, sebelum catch-all:
${routes}
\`\`\`

## 3. Navigasi (otomatis)

Sudah ditambahkan otomatis di \`src/app/navigation.tsx\` saat generate via dev-server.
Referensi manual bila perlu:

\`\`\`tsx
${reg.navSnippet}
\`\`\`

## 4. Permission keys (otomatis dari base \`${permissions.base}\`)

| Aksi | Key |
| --- | --- |
| Lihat list & detail + menu navigasi | \`${permissions.view}\` |
| Buat data | \`${permissions.create}\` |
| Ubah data | \`${permissions.update}\` |
| Hapus / restore data | \`${permissions.delete}\` |
${features.bulkUpload ? `| Bulk upload | \`${permissions.bulkUpload}\` |\n` : ''}${features.export ? `| Export | \`${permissions.export}\` |\n` : ''}
Konstanta tersedia di \`permissions.ts\` (\`${names.entity}Permissions\`).
Pastikan permission user (mis. \`localStorage["permissions"]\`) memuat key di atas
agar menu dan aksi tampil.
${features.export || features.bulkUpload ? `
## 5. API real (bulk/export)

Kontrak endpoint yang diharapkan service saat \`USE_MOCK\` dimatikan:

| Aksi | Method & endpoint | Catatan |
| --- | --- | --- |
${features.export ? `| Export | \`GET /api/v1/${names.pluralKebab}/export\` | Query params sama seperti list; response blob \`.xlsx\`. |\n` : ''}${features.bulkUpload ? `| Bulk upload | \`POST /api/v1/${names.pluralKebab}/bulk-upload\` | Multipart field \`file\` (.xlsx); response \`BulkUploadResult\`. |\n| Template bulk | \`GET /api/v1/${names.pluralKebab}/bulk-template\` | Response blob \`.xlsx\` template. |\n` : ''}
` : ''}
## ${features.export || features.bulkUpload ? '6' : '5'}. Verifikasi

\`\`\`bash
npm run lint && npm run build
\`\`\`

Mock aktif secara default (\`USE_MOCK\` semua \`true\` di \`api/mock.ts\`).
Untuk memakai API real, ubah flag yang relevan menjadi \`false\`.
`;
}
