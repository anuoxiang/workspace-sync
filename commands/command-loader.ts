import { Command } from 'commander';
import { ExportCommand } from './export.command';
import {
  ExportAction,
  SaveToFileAction,
  // SourceAction,
} from '../actions';
// import { SourceCommand } from './source.command';

export class CommandLoader {
  public static load(program: Command): void {
    new ExportCommand(new ExportAction()).load(program);
    // new SourceCommand(new SourceAction()).load(program);
  }
}
