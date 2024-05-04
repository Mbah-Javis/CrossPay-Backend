require("dotenv").config();
const express = require('express');
const cors = require("cors");
const app = express();

app.use(cors({origin: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/api', (req, res) => {
    res.send('Hello there!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
