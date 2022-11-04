import React from 'react';
import { useCounterContext } from './store';
import { Button, Container } from 'react-bootstrap';

function App() {
  const { counter, dispatch, actions } = useCounterContext();
  const { count } = counter;

  return (
    <Container>
      <Button onClick={() => dispatch(actions.increment())}>Increment</Button>
      <div>{count}</div>
    </Container>
  );
}

export default App;
