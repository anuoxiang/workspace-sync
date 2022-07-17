import { Command, OptionValues } from 'commander';
import { AbstractCommand } from './abstract.command';
import { AbstractOptions } from './abstract.options';

export class SaveToFileCommand extends AbstractOptions {
  public load(program: Command): Command {
    return program.option(
      '-o, --output <output-file>',
      'Export the repos to a JSON file.',
    );
  }
}
