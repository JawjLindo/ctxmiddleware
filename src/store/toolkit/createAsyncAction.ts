import React from 'react';
import { createAction, PayloadActionCreator } from 'react-ctx-toolkit';
import { ActionCreator } from './actionCreator';

type AsyncAction<Returned extends any = any> = {
  pending: PayloadActionCreator;
  fulfilled: PayloadActionCreator<Returned>;
  rejected: PayloadActionCreator<string>;
};

const createAsyncAction = <Returned>(
  actionPrefix: string
): AsyncAction<Returned> => {
  const pending = createAction(`${actionPrefix}/pending`);
  const fulfilled = createAction<Returned>(`${actionPrefix}/fulfilled`);
  const rejected = createAction<string>(`${actionPrefix}/rejected`);
  return { pending, fulfilled, rejected };
};

const createAsyncActionCreator = <
  FuncRet extends any = any,
  Arg extends any = undefined
>(
  asyncAction: AsyncAction,
  func: (arg: Arg) => Promise<FuncRet>
): ActionCreator<Arg> => {
  type TPending = ReturnType<typeof asyncAction.pending>;
  type TFulfilled = ReturnType<typeof asyncAction.fulfilled>;
  type TRejected = ReturnType<typeof asyncAction.rejected>;
  type TDispatch = TPending | TFulfilled | TRejected;

  const asyncActionCreator: ActionCreator<Arg> = (
    dispatch: React.Dispatch<TDispatch>,
    arg: Arg
  ): void => {
    dispatch(asyncAction.pending());
    func(arg)
      .then((result) => dispatch(asyncAction.fulfilled(result)))
      .catch((reason) => dispatch(asyncAction.rejected(reason)));
  };

  return asyncActionCreator;
};

export const createAsyncThunk = <
  Returned extends any = any,
  Arg extends any = undefined
>(
  actionPrefix: string,
  func: (arg: Arg) => Promise<Returned>
): [action: AsyncAction<Returned>, creator: ActionCreator<Arg>] => {
  const action = createAsyncAction<Returned>(actionPrefix);
  const creator = createAsyncActionCreator<Returned, Arg>(action, func);
  return [action, creator];
};
