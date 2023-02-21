import axios from 'axios'

// eslint-disable-next-line no-undef
const isDevelopment = process.env.NODE_ENV === 'development'

const baseUrl = isDevelopment ? 'http://localhost:3003/api/login' : '/api/login'

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }
