import {
  Controller,
  Post,
  UseInterceptors,
  Req,
  Res,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { AuthGuard } from 'src/auth/decorator/auth.decorator';
import { Request } from 'express';

@Controller('attachments')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('attachment'))
  @AuthGuard()
  async uploadFile(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: /image\/(png|jpg|jpeg)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body,
    @Req() req: Request,
    @Res() res,
  ) {
    const rs = await this.uploadsService.upload(
      file[0],
      body.field,
      req.user.id,
    );
    return res.status(200).json(rs);
  }
}