import { Statement } from 'typescript';
import { Action } from './createAction';

type ThunkAction<
  ReturnType,
  State,
  ExtraThunkArg,
  BasicAction extends Action
> = (
  dispatch: ThunkDispatch<State, ExtraThunkArg, BasicAction>,
  getState: () => State,
  extraArgument: ExtraThunkArg
) => ReturnType;

export interface ThunkDispatch<
  State,
  ExtraThunkArg,
  BasicAction extends Action
> {
  <ReturnType>(
    thunkAction: ThunkAction<ReturnType, Statement, ExtraThunkArg, BasicAction>
  ): ReturnType;
  <Action extends BasicAction>(action: Action): Action;
  <ReturnType, Action extends BasicAction>(
    action: Action | ThunkAction<ReturnType, State, ExtraThunkArg, BasicAction>
  ): Action | ReturnType;
}
