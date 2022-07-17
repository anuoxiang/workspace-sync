import { Command } from 'commander';
import { AbstractAction } from '../actions';

export abstract class AbstractOptions {
  public abstract load(program: Command): Command;
}
