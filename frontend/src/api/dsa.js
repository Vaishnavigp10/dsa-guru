import client from './client'

export const arrayOperation  = (data) => client.post('/dsa/array/',      data)
export const linkedListOp    = (data) => client.post('/dsa/linkedlist/',  data)
export const stackOperation  = (data) => client.post('/dsa/stack/',       data)
export const queueOperation  = (data) => client.post('/dsa/queue/',       data)
export const treeOperation   = (data) => client.post('/dsa/tree/',        data)
export const graphOperation  = (data) => client.post('/dsa/graph/',       data)
export const hashOperation   = (data) => client.post('/dsa/hashtable/',   data)
export const sortingOperation= (data) => client.post('/dsa/sorting/',     data)
export const getTopics       = ()     => client.get('/dsa/topics/')