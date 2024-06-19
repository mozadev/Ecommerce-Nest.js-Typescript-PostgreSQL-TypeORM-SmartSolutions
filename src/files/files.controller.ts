import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  // express is difined globally in nestjs
  uploadProductImage(file: Express.Multer.File) {
    return 'hola mundo';
  }
}
