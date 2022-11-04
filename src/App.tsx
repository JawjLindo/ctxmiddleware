import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { useCounterActions, useCounterDispatch, useCounterSelector } from './store';

function App() {
  const dispatch = useCounterDispatch();
  const {count} = useCounterSelector();
  const actions = useCounterActions();

  return (
    <Container>
      <Button onClick={() => dispatch(actions.increment(5))}>Increment</Button>
      <div>{count}</div>
    </Container>
  );
}

export default App;
