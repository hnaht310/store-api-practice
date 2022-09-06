require('dotenv').config();
require('express-async-errors'); // async errors
const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const productsRouter = require('./routes/products');

const port = process.env.PORT || 3000;

const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');

// middleware
app.use(express.json()); // we're mot using this for the project

// routes
app.get('/', (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

// products route: mount the productsRouter at path 'api/v1/products'
app.use('/api/v1/products', productsRouter);

// app.use() for error handlers applied on any routes that are not specified as above
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const start = async () => {
  try {
    // connectDB is a function that returns a promise
    // process.env.MONGO_URI to access MONGO_URI variable inside the .env file
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (err) {
    console.log(err);
  }
};

start();
