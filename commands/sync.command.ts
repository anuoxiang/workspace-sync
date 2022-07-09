import { Command, OptionValues } from 'commander';
import { AbstractCommand } from './abstract.command';
import { Input } from './command-input';

export class SyncCommand extends AbstractCommand {
  public load(program: Command): void {
    program
      // 主命令，当前命令的模块级应用
      .command('sync <path-to-workspace>')
      // 别名
      .alias('s')
      .description('Sync workspace to remote storage')
      // 命令的选项（参数），用于微调、控制命令的各项细节功能
      .option(
        '-o, --output <output-file>',
        'Export the repos to a JSON file.',
      )
      .option(
        '-e, --exclude <pattern...>',
        'Exclude files(dirs) of syncs.',
      )
      // 处理命令参数
      .action(
        (
          pathToWorkspace: string,
          command: OptionValues,
        ) => {
          // 必选关键参数
          const inputs: Input[] = [];
          inputs.push({
            name: 'path',
            value: pathToWorkspace,
          });
          // console.log(pathToWorkspace);
          // console.log(command);

          const options: Input[] = [];

          options.push({
            name: 'exclude',
            value: command.exclude,
          });

          this.action.handle(inputs, options);
        },
      );
  }
}
