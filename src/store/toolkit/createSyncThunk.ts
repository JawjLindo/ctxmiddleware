import React from 'react';
import { createAction, PayloadActionCreator } from 'react-ctx-toolkit';
import { ActionCreator } from './actionCreator';

type SyncAction<Returned extends any = any> = PayloadActionCreator<Returned>;

const createSyncActionCreator = <Arg extends any = undefined>(
  syncAction: SyncAction
): ActionCreator<Arg> => {
  type TDispatch = ReturnType<typeof syncAction>;

  const syncActionCreator: ActionCreator<Arg> = (
    dispatch: React.Dispatch<TDispatch>,
    arg: Arg
  ): void => dispatch(syncAction(arg));

  return syncActionCreator;
};

export const createSyncThunk = <Returned extends any = any>(
  actionPrefix: string
): [action: SyncAction<Returned>, creator: ActionCreator<Returned>] => {
  const action = createAction<Returned>(actionPrefix);
  const creator = createSyncActionCreator<Returned>(action);
  return [action, creator];
};
