import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { EchoModule } from './echo/echo.module';
import { GreeterModule } from './greeter/greeter.module';
import { PhotoModule } from 'photo/photo.module';

@Module({
  imports: [
    TelegrafModule.forRoot({
      botName: 'echo',
      token: process.env.ECHO_BOT_TOKEN,
      include: [EchoModule, PhotoModule],
    }),

    TelegrafModule.forRoot({
      botName: 'greeter',
      token: process.env.GREETER_BOT_TOKEN,
      include: [GreeterModule],
    }),

    EchoModule,
    PhotoModule,
    GreeterModule,
  ],
})
export class AppModule { }
