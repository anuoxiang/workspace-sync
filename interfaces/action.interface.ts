import { IActionParams } from './action-params.interface';

/**
 * 单环节行为约束
 */
export interface IAction {
  /**
   * 处理命令解析参数以及上一个行为的结果
   * @param params commander标准参数
   * @param result 上次执行结果
   */
  handle(
    params: IActionParams,
    result?: any,
  ): Promise<void>;

  setNext(nextHandler: IAction): IAction;

  next(params: IActionParams): Promise<void>;
}
