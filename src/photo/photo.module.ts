import { Module } from '@nestjs/common';
import { PhotoUpdate } from './photo.update';
import { PhotoService } from './photo.service';

@Module({
  providers: [PhotoService, PhotoUpdate],
})
export class PhotoModule { }
