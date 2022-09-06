const Product = require('../models/product'); // import Product model/schema

const getAllProductsStatic = async (req, res) => {
  //   const products = await Product.find({}); // find all documents
  const products = await Product.find({
    name: 'vase table',
  });
  res.status(200).json({ products, nbHits: products.length }); // respond with products and products length
};

// find(): first parameter is filter, which is an object -> match the model's schema before the command is sent
// if it can't find anything that matches the request, in Mongoose v5, it will return an empty array. BUT IN Mongoose V6, it will ignore the properties if it's not in the schema
const getAllProducts = async (req, res) => {
  //   console.log(req.query); // eg: {featured: 'true'} or { name: 'john', featured: 'true' }
  const products = await Product.find(req.query); // req.query is already an object so we don't need to add {}
  res.status(200).json({ products });
};

module.exports = { getAllProductsStatic, getAllProducts };
