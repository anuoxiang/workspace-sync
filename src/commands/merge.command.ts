import { Argument, Command, Option, program } from 'commander';
import {
  ConflictJudge,
  ConflictResolve,
  Direction,
  MergeAction,
} from '../actions/merge.action';
import { Config } from '../configs';

export class MergeCommand {
  public load(program: Command): void {
    program
      .command('merge')
      .alias('m')
      .description('Merge remote repo and local repo')
      .addArgument(
        new Argument(
          '<remote-url>',
          'specify a remote(url) to (or from) local.',
        ),
      )
      .addArgument(
        new Argument('<merge-direction>', 'merge direction').choices([
          'upload',
          'download',
        ]),
      )
      .addOption(
        new Option(
          '-c, --conflict [conflict]',
          'How to deal with conflicts, source first(default), target first or stop',
        ).choices(['source', 'targe', 'overwrite', 'stop']),
      )
      .addOption(
        new Option(
          '-k, --key-as [key-as]',
          'The basis for determining whether there is a conflict',
        ).choices(['directory', 'repo']),
      )

      .action(async (url: string, mergeDirection, options) => {
        new MergeAction().handle(
          url,
          mergeDirection,
          options.conflict,
          options.keyAs,
        );
      });
  }
}
