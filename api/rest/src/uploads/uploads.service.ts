import { AttachmentField } from 'shop-shared/dist/attachment';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class UploadsService {
  private readonly s3Client = new S3Client({
    region: process.env.AWS_REGION,
  });

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async upload(file: Express.Multer.File, field: string, userId: string) {
    this.eventEmitter.emit('upload', {
      file,
      field,
      userId,
    });
    return {
      success: true,
      data: 'uploading...',
    };
  }

  @OnEvent('upload')
  async uploadToS3({
    file,
    field,
    userId,
  }: {
    file: Express.Multer.File;
    field: string;
    userId: string;
  }) {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const objectKey = `${Date.now()}-${file.originalname}`;
    const rs = await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        Body: file.buffer,
      }),
    );
    if (rs.$metadata.httpStatusCode !== 200) {
      throw new Error('Upload failed');
    }
    this.eventEmitter.emit(field as AttachmentField, {
      url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${objectKey}`,
      userId,
    });
  }
}
