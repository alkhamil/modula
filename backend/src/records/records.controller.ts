import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RecordsService } from './records.service';

type QueryBag = Record<string, string | undefined>;

/** CRUD generik `/{plural}` sesuai kontrak (export/bulk menyusul di Fase 3). */
@Controller()
export class RecordsController {
  constructor(private readonly service: RecordsService) {}

  @Get(':plural')
  list(@Param('plural') plural: string, @Query() query: QueryBag) {
    return this.service.list(plural, query);
  }

  @Get(':plural/:segment')
  async segment(
    @Param('plural') plural: string,
    @Param('segment') segment: string,
    @Query() query: QueryBag,
  ) {
    const resolved = await this.service.resolveSegment(plural, segment);
    if (resolved.kind === 'options' && resolved.fieldSegment) {
      return this.service.options(plural, resolved.fieldSegment, query);
    }
    return this.service.get(plural, resolved.id as number);
  }

  @Post(':plural')
  @HttpCode(201)
  create(@Param('plural') plural: string, @Body() body: Record<string, unknown>) {
    return this.service.create(plural, body);
  }

  @Put(':plural/:id')
  update(
    @Param('plural') plural: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Record<string, unknown>,
  ) {
    return this.service.update(plural, id, body);
  }

  @Delete(':plural/:id')
  remove(@Param('plural') plural: string, @Param('id', ParseIntPipe) id: number) {
    return this.service.remove(plural, id);
  }

  @Patch(':plural/:id/restore')
  restore(@Param('plural') plural: string, @Param('id', ParseIntPipe) id: number) {
    return this.service.restore(plural, id);
  }
}
