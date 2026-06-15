import client from './client'

export const sendMessage    = (data)  => client.post('/chatbot/', data)
export const getChatHistory = (id)    => client.get(`/chatbot/history/${id}/`)
export const clearChat      = (id)    => client.delete(`/chatbot/clear/${id}/`)
export const getSuggestions = (topic) => client.get(`/chatbot/suggestions/?topic=${topic}`)