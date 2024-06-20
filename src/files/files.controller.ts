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
  BadRequestException,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { Console } from 'console';
import { diskStorage } from 'multer';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // express is difined globally in nestjs
  // we need use decorator UploadedFile to get the file
  // @body or @query or @res instead of @UploadedFile to get something of
  // send the reference with fileFilter function, I don't excecuting the function, fileInterceptor will do ti with the arguments
  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      // limits: { fileSize: 1000 },
      storage: diskStorage({
        destination: './static/uploads',
      }),
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    // console.log(file);
    // console.log({ fileInController: file });

    if (!file) {
      throw new BadRequestException('Make sure the file is a image');
    }

    return {
      fileName: file.originalname,
    };
  }
}
// the file is saved on temp folder, still no exist in file system
// this could be send to a service like aws s3 or google cloud storage or cloudinary
