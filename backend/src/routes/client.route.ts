import express from 'express'

export const clientRouter = express.Router()

// Anyone can get clients information
clientRouter.get('/')

// Anyone can create a client
clientRouter.post('/')

// Anyone can get client info
clientRouter.get('/:id')

// The creator of the client can update
// Admin can update any client
clientRouter.put('/:id')

// The creator of the client can delete his/her own entry
// Admin can delete any client
clientRouter.delete('/:id')
