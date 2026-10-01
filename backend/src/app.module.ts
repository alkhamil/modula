import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildDataSourceOptions } from './config/database.config';
import { ModuleDefinitionEntity } from './definitions/entities/module-definition.entity';
import { RecordEntity } from './records/entities/record.entity';
import { HealthModule } from './health/health.module';
import { DefinitionsModule } from './definitions/definitions.module';
import { RecordsModule } from './records/records.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      // Inject ConfigService agar factory jalan setelah .env dimuat; nilai dibaca dari process.env.
      inject: [ConfigService],
      useFactory: () =>
        buildDataSourceOptions(process.env, [ModuleDefinitionEntity, RecordEntity]),
    }),
    HealthModule,
    // Urutan penting: DefinitionsModule sebelum RecordsModule agar
    // `/:plural` generik tidak membayangi `/module-definitions`.
    DefinitionsModule,
    RecordsModule,
  ],
})
export class AppModule {}
