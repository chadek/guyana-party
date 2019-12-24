import { State, subscribe } from 'jstates-react'

export const snackState = new State('snackState', { msg: '', variant: '' })

export { subscribe }
