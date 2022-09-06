// add package.json to our database automatically => need to create another connection to the DB

require('dotenv').config(); // import dotenv (which has the MONGO_URI variable - connection string)

const connectDB = require('./db/connect'); // import connect function
const Product = require('./models/product'); // import Product model/schema
const jsonProducts = require('./products.json'); // import the products.json file

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Product.deleteMany(); // delete any data that we currently have in the database. we can omit this step
    await Product.create(jsonProducts); // Model.create() returns a promise => this will insert a document or multiple documents into the DB
    process.exit(0); // terminate the process (0 means success)
    console.log('success!!');
  } catch (err) {
    console.log(err);
    process.exit(1); // terminate the process (1 for error)
  }
};

start(); // when this runs, a new database 04-store-api will be created in Atlas
