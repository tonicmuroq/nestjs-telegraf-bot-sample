import { UseFilters, UseInterceptors } from '@nestjs/common';
import {
  Help,
  InjectBot,
  Start,
  Update,
  Hears,
  Action,
  Command,
} from 'nestjs-telegraf';
import { Telegraf, Context, Markup } from 'telegraf';
import { ResponseTimeInterceptor } from '../common/interceptors/response-time.interceptor';
import { TelegrafExceptionFilter } from '../common/filters/telegraf-exception.filter';
import * as path from 'path';

@Update()
@UseInterceptors(ResponseTimeInterceptor)
@UseFilters(TelegrafExceptionFilter)
export class PhotoUpdate {

  constructor(
    @InjectBot('echo')
    private readonly bot: Telegraf,
  ) { }

  @Start()
  async onStart(): Promise<string> {
    const me = await this.bot.telegram.getMe();
    return `start: Hey, I'm ${me.first_name}`;
  }

  @Help()
  async onHelp(): Promise<string> {
    return 'this is a help message! try type "emoji"';
  }

  @Hears('emoji')
  onEmoji(ctx: Context): void {
    ctx.reply('you said emoji',
      Markup.inlineKeyboard([
        Markup.button.callback('无语', 'nowords'),
        Markup.button.callback('尴尬', 'awkward'),
      ])
    );
  }

  @Action('nowords')
  onNowords(ctx: Context): void {
    ctx.deleteMessage();
    ctx.replyWithPhoto(
      {
        source: path.resolve('src/photo/images/无语.png'),
      },
      {
        caption: '无语了吧...',
      },
    );
  }

  @Action('awkward')
  onAwkward(ctx: Context): void {
    ctx.deleteMessage();
    ctx.replyWithPhoto(
      {
        source: path.resolve('src/photo/images/尴尬.png'),
      },
      {
        caption: '好尴尬啊...',
      },
    );
  }

  @Command('special')
  onSpecial(ctx: Context): void {
    ctx.reply(
      'Special buttons keyboard',
      Markup.keyboard([
        Markup.button.contactRequest('Send contact'),
        Markup.button.locationRequest('Send location')
      ]).resize().oneTime()
    );
  }

  @Command('caption')
  onCaption(ctx: Context): void {
    ctx.replyWithPhoto(
      'https://picsum.photos/200/300/?random',
      {
        caption: 'Caption',
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          Markup.button.callback('Plain', 'plain'),
          Markup.button.callback('Italic', 'italic')
        ])
      }
    );
  }

  @Action('plain')
  onActionPlain(ctx: Context): void {
    ctx.answerCbQuery();
    ctx.editMessageCaption(
      'Caption[p]',
      Markup.inlineKeyboard([
        Markup.button.callback('* Plain *', 'plain'),
        Markup.button.callback('Italic', 'italic')
      ]),
    );
  }

  @Action('italic')
  onActionItalic(ctx: Context): void {
    ctx.answerCbQuery();
    ctx.editMessageCaption(
      '_Caption_',
      Markup.inlineKeyboard([
        Markup.button.callback('Plain', 'plain'),
        Markup.button.callback('* Italic *', 'italic')
      ]),
    );
  }

}
