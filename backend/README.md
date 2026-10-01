# Backend — generator-module-app

NestJS + TypeORM + MySQL. Melayani definisi modul dinamis + records generik
(kontrak: `../docs/backend-contract.md`).

## Jalan lokal

```bash
cp .env.example .env          # sekali saja
docker compose up -d          # MySQL :3306
npm run migration:run         # skema awal
npm run seed                  # seed definisi + sample records
npm run start:dev             # API :3000 (/api/v1/...)
```

## Perintah

- `npm run build` / `npm test` / `npm run test:e2e` (e2e butuh MySQL jalan)
- `npm run migration:generate -- <Nama>` / `npm run migration:run`
- `docker compose down` untuk mematikan MySQL (`-v` untuk hapus data)
