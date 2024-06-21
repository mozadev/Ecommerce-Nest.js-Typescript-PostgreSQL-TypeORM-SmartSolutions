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
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { fileNamer, fileFilter } from './helpers';
import { Response } from 'express';
import { ok } from 'assert';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response, // I'm gonna take control of what I'm gonna respond to the user
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);

    res.sendFile(path); // send the file (image, pdf ...) to the user
    // to send path
    // res.status(403).json({
    //   ok: true,
    //   path: path,
    // });
  }

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
        destination: './static/products',
        filename: fileNamer,
      }),
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    // console.log({ fileInController: file });

    if (!file) {
      throw new BadRequestException('Make sure the file is a image');
    }

    // console.log(file);
    //const secureUrl = `${file.filename}`;
    const secureUrl = `http://localhost:3000/api/files/product/a7e4a966-13f3-4c68-bb36-82a1e0aa89d9.jpeg`;

    return {
      secureUrl,
      // fileName: file.originalname,
    };
  }
}
// the file is saved on temp folder, still no exist in file system
// this could be send to a service like aws s3 or google cloud storage or cloudinary
