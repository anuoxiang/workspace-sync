import { IStorage, IWorkspace } from '../interfaces';
export abstract class AbstractStroage implements IStorage {
  abstract write(target: string, workspace: IWorkspace): void;
  abstract read(target: string): Promise<IWorkspace>;
  abstract delete(target: string): void;
}
