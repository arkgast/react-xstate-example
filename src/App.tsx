import React, { useState } from 'react'
import { Machine } from 'xstate'
import { useMachine } from '@xstate/react'

const stateMachine = Machine({
  initial: 'idle',
  states: {
    idle: {
      on: {
        SUBMIT: [
          {
            target: 'loading',
            cond: (ctx, event) => event.data.name && event.data.phone
          },
          {
            target: 'error'
          }
        ]
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
        SUBMIT: {
          target: 'loading',
          cond: (_, event) =>  event.data.name && event.data.phone
        }
      }
    },
    success: {
      type: 'final'
    }
  }
})

const App = () => {
  const [machine, send] = useMachine(stateMachine)
  const [model, setModel] = useState({ name: '', phone: '' })

  console.log(machine.value)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setModel(currentModel => ({
      ...currentModel,
      [name]: value
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    send({ type: 'SUBMIT', data: model })
  }

  return (
    <div>
      <h1>React State Machine</h1>
      <form onSubmit={handleSubmit}>
        <p>
          <label htmlFor="name">Name: </label>
          <input type='text' name='name' value={model.name} onChange={handleChange} />
        </p>
        <p>
          <label htmlFor="phone">Phone: </label>
          <input type='number' name='phone' value={model.phone} onChange={handleChange} />
        </p>
        <p>
          <button onClick={() => {}}>Save</button>
        </p>
      </form>
    </div>
  )
}

export default App
