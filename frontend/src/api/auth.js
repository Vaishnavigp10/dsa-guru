import client from './client'

export const register       = (data) => client.post('/auth/register/', data)
export const login          = (data) => client.post('/auth/login/',    data)
export const refreshToken   = (data) => client.post('/auth/refresh/',  data)
export const logout         = (data) => client.post('/auth/logout/',   data)
export const getProfile     = ()     => client.get('/auth/profile/')
export const updateProfile  = (data) => client.put('/auth/profile/',   data)