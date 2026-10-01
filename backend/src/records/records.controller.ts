import {
  BadRequestException,
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
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { RecordsService } from './records.service';
import { XLSX_MIME } from './excel';

type QueryBag = Record<string, string | undefined>;

interface UploadedXlsx {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

/** CRUD + export/bulk generik `/{plural}` sesuai kontrak. */
@Controller()
export class RecordsController {
  constructor(private readonly service: RecordsService) {}

  @Get(':plural')
  list(@Param('plural') plural: string, @Query() query: QueryBag) {
    return this.service.list(plural, query);
  }

  // Route statis di bawah HARUS di atas `:plural/:segment` agar tidak tertangkap segment handler.
  @Get(':plural/export')
  async export(
    @Param('plural') plural: string,
    @Query() query: QueryBag,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Buffer> {
    const { filename, buffer } = await this.service.exportWorkbook(plural, query);
    res.set({
      'Content-Type': XLSX_MIME,
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    return buffer;
  }

  @Get(':plural/bulk-template')
  async bulkTemplate(
    @Param('plural') plural: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Buffer> {
    const { filename, buffer } = await this.service.bulkTemplate(plural);
    res.set({
      'Content-Type': XLSX_MIME,
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    return buffer;
  }

  @Post(':plural/bulk-upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  bulkUpload(@Param('plural') plural: string, @UploadedFile() file?: UploadedXlsx) {
    if (!file) throw new BadRequestException('File wajib diunggah (field "file").');
    return this.service.bulkUpload(plural, file.buffer);
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
