import { Command } from 'commander';
import { ExportCommand } from './export.command';
import { ExportAction, SaveToFileAction } from '../actions';

export class CommandLoader {
  public static load(program: Command): void {
    new ExportCommand(new ExportAction()).load(program);
  }
}
