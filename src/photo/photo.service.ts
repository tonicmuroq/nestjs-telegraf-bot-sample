import { Injectable } from '@nestjs/common';

@Injectable()
export class PhotoService {

  echo(text: string): string {
    return `Echo: ${text}`;
  }

}
