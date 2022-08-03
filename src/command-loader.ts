import { Command } from 'commander';
import { MergeCommand, PickupCommand } from './commands';

/**
 * 命令装载器
 * 考虑到会有大量的依赖，并且依赖关系，顾采用IoC的思路
 * 实现的模式，采用啥呢？
 */
export class CommandLoader {
  public static load(program: Command): void {
    new PickupCommand().load(program);
    new MergeCommand().load(program);
  }
}
