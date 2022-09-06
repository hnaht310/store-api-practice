// import mongoose module
const mongoose = require('mongoose');

// Define a schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'product name must be provided'],
  },
  price: {
    type: Number,
    required: [true, 'product price must be provided'],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    enum: ['ikea', 'liddy', 'caressa', 'marcos'], // limit the number of options/companies
    message: '{VALUE} is not supported', // CUSTOM ERROR MESSAGE -> if company name provided does not match any value in the enum list
    // enum: ['ikea', 'liddy', 'caressa', 'marcos'], // limit the number of options/companies
  },
});

module.exports = mongoose.model('Product', productSchema);
