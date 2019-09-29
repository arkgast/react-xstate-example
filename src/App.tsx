import React from 'react'
import { Machine } from 'xstate'
import { useMachine } from '@xstate/react'

const stateMachine = Machine({
  initial: 'idle',
  states: {
    idle: {
      on: {
        SUBMIT: 'loading'
      }
    },
    loading: {
      on: {
        PAYMENT_RECEIVED: 'success',
        PAYMENT_FAILED: 'error'
      }
    },
    error: {
      on: {
        SUBMIT: 'loading'
      }
    },
    success: {
      type: 'final'
    }
  }
})

const App = () => {
  const [machine, send] = useMachine(stateMachine)

  console.log(machine.value)

  return (
    <div>
      <h1>React State Machine</h1>
      <button onClick={() => send({ type: 'SUBMIT', data: {} })}>Change state</button>
    </div>
  )
}

export default App
