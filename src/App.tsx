import React, { useState } from 'react'
import { Machine, assign } from 'xstate'
import { useMachine } from '@xstate/react'

const fakeRegister = () => {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      resolve('ok')
      window.clearTimeout(timer)
    }, 1500)
  })
}

const stateMachine = Machine({
  initial: 'idle',
  context: {
    msg: ''
  },
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
      invoke: {
        id: 'doRegister',
        src: (ctx, event) => fakeRegister(),
        onDone: {
          target: 'success',
          actions: assign({ msg: (ctx: any, event: any) => event.data })
        },
        onError: {
          target: 'error',
          actions: assign({ msg: (ctx: any, event: any) => event.data })
        }
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
      <h3>Current state: {machine.value}</h3>
      {machine.matches('error') && (
        <div>
          {machine.context.msg && <p>{machine.context.msg}</p>}
        </div>
      )}
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
          <button>Save</button>
        </p>
      </form>
    </div>
  )
}

export default App
