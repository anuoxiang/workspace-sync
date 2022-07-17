import { Command } from 'commander';
import { AbstractOptions } from './abstract.options';

export class UploadToMockAPICommand extends AbstractOptions {
  public load(program: Command): Command {
    return program
      .option(
        '-a, --api <url-to-api>',
        'Upload to the api that save the result.',
      )
      .option(
        '-d, --dry',
        'Only test to mach remote configuration.',
      )
      .option('-m, --merge', 'Merge a repo into');
  }
}
