import React from 'react';
import { Button, Container } from 'react-bootstrap';
import {
  useCounterActions,
  useCounterDispatch,
  useCounterSelector,
} from './store';

function App() {
  const dispatch = useCounterDispatch();
  const state = useCounterSelector();
  const actions = useCounterActions();

  const successHandler = () => {
    actions.asyncrement(dispatch, {
      incrementValue: 5,
      interval: 1000,
    });
  };
  const failureHandler = () => {
    actions.asyncrement(dispatch, {
      incrementValue: 5,
      interval: 1000,
      fail: true,
    });
  };

  return (
    <Container>
      <Button onClick={() => actions.increment(dispatch, 5)}>Increment</Button>
      <Button variant='success' onClick={() => successHandler()}>
        Async Increment Successfully
      </Button>
      <Button variant='danger' onClick={() => failureHandler()}>
        Async Increment Unsuccessfully
      </Button>
      <div>Counter: {state.count}</div>
      <div>Status: {state.status}</div>
    </Container>
  );
}

export default App;
