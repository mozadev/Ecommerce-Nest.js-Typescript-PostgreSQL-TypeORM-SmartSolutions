import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // express is difined globally in nestjs
  // we need use decorator UploadedFile to get the file
  // @body or @query or @res instead of @UploadedFile to get something of
  @Post('product')
  @UseInterceptors(FileInterceptor('file'))
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return {
      fileName: file.originalname,
    };
  }
}
// the file is saved on temp folder, still no exist in file system
// this could be send to a service like aws s3 or google cloud storage or cloudinary
