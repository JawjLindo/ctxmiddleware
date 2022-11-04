import React from 'react';
import { ContextMiddleware, useEnhancedReducer } from './enhancedReducer';
// Actions

const INCREMENT = 'INCREMENT';

type IncrementAction = {
  type: typeof INCREMENT;
};
type Actions = IncrementAction;

const increment = (): IncrementAction => {
  return { type: INCREMENT };
};

const actions = { increment };

// Reducer

type CounterState = { count: number };

const counterReducer = (state: CounterState, action: Actions): CounterState => {
  switch (action.type) {
    case INCREMENT:
      const newCount = state.count + 1;
      return { ...state, count: newCount };
    default:
      return state;
  }
};

// Context and Provider

type TContext = {
  counter: CounterState;
  dispatch: React.Dispatch<Actions>;
  actions: typeof actions;
};

const initialState: CounterState = { count: 0 };

const CounterContext = React.createContext<TContext>({
  counter: initialState,
  dispatch: () => {},
  actions,
});

const logMiddleware =
  (id: number): ContextMiddleware<typeof counterReducer> =>
  (state) =>
  (getState) =>
  (next) =>
  (action) => {
    console.log(id, 'before action', action, getState());
    next(action);
    console.log(id, 'after action', action, getState());
  };

const CounterProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [counter, dispatch] = useEnhancedReducer(counterReducer, initialState, [
    logMiddleware(1),
    logMiddleware(2),
  ]);

  return React.createElement(
    CounterContext.Provider,
    { value: { counter, dispatch, actions } },
    children
  );
};

const useCounterContext = () => React.useContext(CounterContext);

export { CounterProvider, useCounterContext };
