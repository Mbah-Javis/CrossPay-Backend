require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const auth = require('./middleware/auth')
const verifySource = require('./middleware/verify_source')
const { crossPayLogger, crossPayResponse } = require('./utils/utils')
const moneyTransferRouter = require('./routes/money_transfer_route')
const completeTrasactionRouter = require('./routes/complete_transaction_route')

app.use(cors({ origin: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api', (req, res) => {
  return crossPayResponse.sendSuccessResponse(res, 'Hello there')
})

// Money transfer main route
app.use('/api/money-transfer', verifySource, auth, moneyTransferRouter)
// Complete transactions web-hooks
app.use('/api/complete', completeTrasactionRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  crossPayLogger.info(`Server is running on port ${PORT}`)
})
