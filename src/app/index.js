const express = require('express');
const app = express();
const rootRouter = require("../routes/");

app.use(express.json());
app.use(
  express.urlencoded({ extended: true, limit: "50mb", parameterLimit: 50000 })
);


var cors = require('cors');

//cors
app.use(cors({
  origin: '*'
}))

// Database-connection
require('../utils/db')();


app.use("/api/v1", rootRouter);


module.exports = app;