import React from 'react';
import { ContextMiddleware } from './toolkit';
import { createAction } from './toolkit';
import { createReducer } from './toolkit';
import { createContext } from './toolkit';
// Actions

const increment = createAction<number>('INCREMENT');

type Actions = ReturnType<typeof increment>;

const actions = { increment };

// Reducer

type CounterState = { count: number };

const counterReducer = createReducer<CounterState>((builder) => {
  builder.addCase(actions.increment, (state, action) => {
    state.count += action.payload;
    return state;
  })
})

// Context and Provider

const initialState: CounterState = { count: 0 };

const logMiddleware: (id: number) => ContextMiddleware<typeof counterReducer> =
  (id: number) =>
  (state) =>
  (getState) =>
  (next) =>
  (action) => {
    console.log(id, 'before action', action, getState());
    next(action);
    console.log(id, 'after action', action, getState());
  };

const { Provider: CounterProvider, hooks: [useCounterSelector, useCounterDispatch, useCounterActions] } =
  createContext({displayName: 'Cuunter', initialState, actions}, counterReducer, [logMiddleware(1)]);

export { CounterProvider, useCounterSelector, useCounterDispatch, useCounterActions };
