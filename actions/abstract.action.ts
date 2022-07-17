import { IAction, IActionParams } from '../interfaces';

/**
 * 抽象活动执行对象
 */
export abstract class AbstractAction implements IAction {
  async next(
    params: IActionParams,
    result?: any,
  ): Promise<void> {
    if (this.nextHandler)
      return this.nextHandler.handle(params, result);
  }
  protected nextHandler: IAction | undefined;
  setNext(nextHandler: IAction): IAction {
    this.nextHandler = nextHandler;
    return nextHandler;
  }
  public abstract handle(
    params: IActionParams,
    result?: any,
  ): Promise<void>;
}
