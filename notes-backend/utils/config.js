require('dotenv').config()

const NODE_ENV = process.env.NODE_ENV || 'development'
const PORT = process.env.PORT || 3001

// Use test DB when NODE_ENV === 'test', otherwise normal DB
const MONGODB_URI = NODE_ENV === 'test'
  ? process.env.MONGODB_URI_TEST
  : process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not set. Create .env with MONGODB_URI and MONGODB_URI_TEST')
}

module.exports = { NODE_ENV, PORT, MONGODB_URI }
