require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const verifySource = require('./middleware/verify_source');
const crossPayLogger = require('./utils/crosspay_logger');
const crossPayResponse = require('./utils/crosspay_response');

app.use(cors({ origin: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api', (req, res) => {
  return crossPayResponse.sendSuccessResponse(res, "Hello there");
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  crossPayLogger.info(`Server is running on port ${PORT}`);
})
