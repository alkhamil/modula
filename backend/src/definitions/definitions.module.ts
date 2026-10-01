import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleDefinitionEntity } from './entities/module-definition.entity';
import { DefinitionsController } from './definitions.controller';
import { DefinitionsService } from './definitions.service';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleDefinitionEntity])],
  controllers: [DefinitionsController],
  providers: [DefinitionsService],
  exports: [DefinitionsService],
})
export class DefinitionsModule {}
