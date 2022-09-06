const Product = require('../models/product'); // import Product model/schema
const { search } = require('../routes/products');

const getAllProductsStatic = async (req, res) => {
  //   const products = await Product.find({}); // find all documents
  const search = 'a';
  const products = await Product.find({
    featured: true, // it will convert true to 'true' in Mongoose.  => REMEMBER in Mongoose, boolean is cast to String
    // foo: 'bar',
    name: { $regex: search, $options: 'i' }, // i: case insensitivity
  });
  // If there's properties that are not in the schema => eg: /products?featured=true&foo=bar-> in Mongoose V5, it will return an empty array (products: []). But in Mongoose V6, it will return results with featured=true -> foo is ignored because it's not in the schema
  res.status(200).json({ products, nbHits: products.length }); // respond with products and products length
};

// find(): first parameter is filter, which is an object -> match the model's schema before the command is sent
// if it can't find anything that matches the request, in Mongoose v5, it will return an empty array. BUT IN Mongoose V6, it will ignore the properties if it's not in the schema
// in Mongoose V6: /v1/products?featured=true <- returns 7 hits,
// in Mongoose V6: /v1/products?featured=true&page=2&foo=bar <- also returns 7 hits because it ignores foo and page because these two are not in the schema

const getAllProducts = async (req, res) => {
  //   console.log(req.query); // eg: {featured: 'true'} or { name: 'john', featured: 'true' }
  //   const products = await Product.find(req.query); // req.query is already an object so we don't need to add {}
  const { featured, company, name } = req.query; // we just pull out what property we're interested in from the req.query
  console.log(req.query);
  console.log(featured);
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  } // check if featured exists  => REMEMBER in Mongoose, boolean is cast to String)
  //   queryObject will be an empty object {} if featured is not in the query eg: localhost:3000/api/v1/products?page=2
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' }; // check if a pattern of characters is in the name. eg: /products?featured=false&company=ikea&name=e ==> search for products with names having letter 'e'
  }
  console.log(queryObject);
  const products = await Product.find(queryObject); // if queryObject is an empty {} => return all products.
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProductsStatic, getAllProducts };
