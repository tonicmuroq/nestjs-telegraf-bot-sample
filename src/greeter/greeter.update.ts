import { Command, Ctx, Hears, Start, Update, Sender } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { UpdateType as TelegrafUpdateType } from 'telegraf/typings/telegram-types';
import { HELLO_SCENE_ID, WIZARD_SCENE_ID } from '../app.constants';
import { UpdateType } from '../common/decorators/update-type.decorator';

@Update()
export class GreeterUpdate {

  @Start()
  onStart(): string {
    return 'Say hello to me';
  }

  @Hears(['hi', 'hello', 'hey', 'qq'])
  onGreetings(
    @UpdateType() updateType: TelegrafUpdateType,
    @Sender('first_name') firstName: string,
    @Ctx() ctx: SceneContext,
  ): string {
    return `Hey ${firstName}, you sent me "${ctx.text}", update type is ${updateType}`;
  }

  @Command('scene')
  onSceneCommand(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter(HELLO_SCENE_ID);
  }

  @Command('wizard')
  onWizardCommand(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter(WIZARD_SCENE_ID);
  }

}
