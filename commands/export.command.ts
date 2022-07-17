import { Command, OptionValues } from 'commander';
import {
  ExportAction,
  SaveToFileAction,
  UploadToMockApiAction,
} from '../actions';
import { AbstractCommand } from './abstract.command';
import { Input } from './command-input';
import { SaveToFileCommand } from './save-to-file.command';
import { UploadToMockAPICommand } from './upload-to-mockapi.command';

export class ExportCommand extends AbstractCommand {
  constructor(action: ExportAction) {
    super(action);
    action
      .setNext(new SaveToFileAction())
      .setNext(new UploadToMockApiAction());
  }
  public load(program: Command): void {
    program = program
      // 主命令，当前命令的模块级应用
      .command('sync [path-to-workspace]')
      // 别名
      .alias('s')
      .description('Sync workspace to remote storage')
      .option(
        '-e, --exclude <pattern...>',
        'Exclude files(dirs) of syncs.',
      );
    // const saveTofile = new SaveToFile();
    // saveTofile.load(program);
    program = new SaveToFileCommand().load(program);
    program = new UploadToMockAPICommand().load(program);
    // 处理命令参数
    program.action(
      (
        pathToWorkspace: string = './',
        command: OptionValues,
      ) => {
        const inputs: OptionValues = {
          path: pathToWorkspace,
        };
        this.action.handle({ inputs, options: command });
      },
    );
  }
}
