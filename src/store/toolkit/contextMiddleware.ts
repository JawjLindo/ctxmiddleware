import { Dispatch, Reducer, ReducerAction, ReducerState } from 'react';

export type ContextMiddleware<R extends Reducer<any, any>> = (
  dispatch: Dispatch<R>,
  getState: () => ReducerState<R>,
  next: (action: ReducerAction<R>) => any
) => (action: ReducerAction<R>) => any;
