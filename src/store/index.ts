import React from 'react';
import { ContextMiddleware, createAction } from './toolkit';
import { createReducer } from './toolkit';
import { createContext } from './toolkit';

type CounterState = {
  count: number;
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error?: string | undefined;
};

// Actions

const incrementAction = createAction<number>('counter/increment');
const increment = (
  dispatch: React.Dispatch<ReturnType<typeof incrementAction>>,
  incrementValue: number
) => dispatch(incrementAction(incrementValue));

const asyncrementAction = {
  pending: createAction('counter/asyncrement/pending'),
  fulfilled: createAction<number>('counter/asyncrement/fulfilled'),
  rejected: createAction<string>('counter/asyncrement/rejected'),
};
const asyncrement = async (
  dispatch: React.Dispatch<
    | ReturnType<typeof asyncrementAction.pending>
    | ReturnType<typeof asyncrementAction.fulfilled>
    | ReturnType<typeof asyncrementAction.rejected>
  >,
  {
    incrementValue,
    interval,
    fail = false,
  }: { incrementValue: number; interval: number; fail?: boolean }
) => {
  dispatch(asyncrementAction.pending());

  new Promise<number>((resolve, reject) => {
    setTimeout(() => {
      if (fail) return reject('Bad things have happened');
      resolve(incrementValue);
    }, interval);
  })
    .then((incrementValue) =>
      dispatch(asyncrementAction.fulfilled(incrementValue))
    )
    .catch((reason) => {
      dispatch(asyncrementAction.rejected(`Threw error: ${reason}`));
    });
};

const actions = { increment, asyncrement };

// Reducer

const counterReducer = createReducer<CounterState>((builder) => {
  builder.addCase(incrementAction, (state, action) => {
    state.count += action.payload;
    state.status = 'idle';
    state.error = undefined;
    return state;
  });
  builder.addCase(asyncrementAction.pending, (state) => {
    state.status = 'pending';
    state.error = undefined;
    return state;
  });
  builder.addCase(asyncrementAction.fulfilled, (state, action) => {
    state.count = state.count + action.payload;
    state.status = 'fulfilled';
    return state;
  });
  builder.addCase(asyncrementAction.rejected, (state, action) => {
    state.error = action.payload;
    state.status = 'rejected';
    return state;
  });
});

// Context and Provider

const initialState: CounterState = { count: 0, status: 'idle' };

const logMiddleware: (id: number) => ContextMiddleware<typeof counterReducer> =
  (id: number) => (dispatch, getState, next) => (action) => {
    console.log(id, 'before action', action, getState());
    next(action);
    console.log(id, 'after action', action, getState());
  };

const {
  Provider: CounterProvider,
  hooks: [useCounterSelector, useCounterDispatch, useCounterActions],
} = createContext(
  { displayName: 'Cuunter', initialState, actions },
  counterReducer,
  [logMiddleware(1)]
);

export {
  CounterProvider,
  useCounterSelector,
  useCounterDispatch,
  useCounterActions,
};
