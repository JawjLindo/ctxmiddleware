import {
  ContextMiddleware,
  createAsyncThunk,
  createContext,
  createReducer,
  createSyncThunk,
} from './toolkit';

type CounterState = {
  count: number;
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error?: string | undefined;
};

// Actions

const [incrementAction, increment] =
  createSyncThunk<number>('counter/increment');

const [asyncrementAction, asyncrement] = createAsyncThunk<
  number,
  { incrementValue: number; interval: number; fail?: boolean }
>(
  'counter/asyncrement',
  async ({ incrementValue, interval, fail = false }): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
      setTimeout(() => {
        if (fail) return reject('Bad things have happened');
        resolve(incrementValue);
      }, interval);
    });
  }
);

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
