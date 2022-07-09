import { Command } from 'commander';
import { SyncCommand } from './sync.command';
import { SyncAction } from '../actions';

export class CommandLoader {
  public static load(program: Command): void {
    new SyncCommand(new SyncAction()).load(program);
  }
}
