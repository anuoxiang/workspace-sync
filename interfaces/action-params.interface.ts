import { OptionValues } from 'commander';

/**
 * 调用过程标准参数
 */
export interface IActionParams {
  inputs: OptionValues;
  options?: OptionValues;
  extraFlags?: string[];
}
