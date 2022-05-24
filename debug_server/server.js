require('dotenv').config();
const express = require('express');
const route = require('./routes')
const cors = require('cors');
const db = require('./config/db');
db.connect();

const app = express();
const PORT = process.env.PORT || 5000;

// midleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

route(app);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
