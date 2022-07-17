import { Command } from 'commander';
import { AbstractOptions } from './abstract.options';

export class UploadToMockAPICommand extends AbstractOptions {
  public load(program: Command): Command {
    return program.option(
      '-a, --api <url-to-api>',
      'Upload to the api that save the result.',
    );
  }
}
