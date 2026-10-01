import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DefinitionsService } from './definitions.service';
import { DefinitionDto, ListDefinitionsQuery } from './dto';

@Controller('module-definitions')
export class DefinitionsController {
  constructor(private readonly service: DefinitionsService) {}

  @Get()
  list(@Query() query: ListDefinitionsQuery) {
    return this.service.list(query.status, query.page ?? 1, query.size ?? 10);
  }

  @Get(':key')
  get(@Param('key') key: string) {
    return this.service.get(key);
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: DefinitionDto) {
    return this.service.create(dto);
  }

  @Put(':key')
  update(@Param('key') key: string, @Body() dto: DefinitionDto) {
    return this.service.update(key, dto);
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.service.remove(key);
  }
}
