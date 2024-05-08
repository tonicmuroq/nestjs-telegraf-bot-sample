import { UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  Help,
  InjectBot,
  On,
  Message,
  Start,
  Update,
  Command,
  Ctx,
} from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { EchoService } from './echo.service';
import { Context } from '../interfaces/context.interface';
import { ReverseTextPipe } from '../common/pipes/reverse-text.pipe';
import { ResponseTimeInterceptor } from '../common/interceptors/response-time.interceptor';
import { AdminGuard } from '../common/guards/admin.guard';
import { TelegrafExceptionFilter } from '../common/filters/telegraf-exception.filter';

@Update()
@UseInterceptors(ResponseTimeInterceptor)
@UseFilters(TelegrafExceptionFilter)
export class EchoUpdate {

  constructor(
    @InjectBot('echo')
    private readonly bot: Telegraf<Context>,
    private readonly echoService: EchoService,
  ) { }

  @Start()
  async onStart(): Promise<string> {
    const me = await this.bot.telegram.getMe();
    return `Hey, I'm ${me.first_name}`;
  }

  @Help()
  async onHelp(): Promise<string> {
    return 'Send me any text';
  }

  @Command('admin')
  @UseGuards(AdminGuard)
  async onAdminCommand(@Ctx() ctx: Context): Promise<string> {
    return `Welcome ${JSON.stringify(ctx.from)}!`;
  }

  @On('text')
  onMessage(
    @Message('text', new ReverseTextPipe()) reversedText: string,
  ): string {
    return this.echoService.echo(reversedText);
  }
}
