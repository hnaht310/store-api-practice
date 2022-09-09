const { query } = require('express');
const product = require('../models/product');
const Product = require('../models/product'); // import Product model/schema
const { search } = require('../routes/products');

const getAllProductsStatic = async (req, res) => {
  //   const products = await Product.find({}); // find all documents
  // const search = 'a';
  // const products = await Product.find({
  //   featured: true, // it will convert true to 'true' in Mongoose.  => REMEMBER in Mongoose, boolean is cast to String
  //   // foo: 'bar',
  //   name: { $regex: search, $options: 'i' }, // i: case insensitivity
  // });
  // // If there's properties that are not in the schema => eg: /products?featured=true&foo=bar-> in Mongoose V5, it will return an empty array (products: []). But in Mongoose V6, it will return results with featured=true -> foo is ignored because it's not in the schema
  // res.status(200).json({ products, nbHits: products.length }); // respond with products and products length
  // const products = await Product.find({}).sort('name'); // ascending order
  // const products = await Product.find({}).sort('-name price'); // negative: descending order. sort by name desc then sort by price asc
  // const products = await Product.find({}).sort('name').select('name price');
  // .limit(10)
  // .skip(3); // skips the first 3 then show next 10
  const products = await Product.find({ price: { $gt: 30 } })
    .sort('price')
    .select('name price');
  res.status(200).json({ products, nbHits: products.length });
};

// find(): first parameter is filter, which is an object -> match the model's schema before the command is sent
// if it can't find anything that matches the request, in Mongoose v5, it will return an empty array. BUT IN Mongoose V6, it will ignore the properties if it's not in the schema
// in Mongoose V6: /v1/products?featured=true <- returns 7 hits,
// in Mongoose V6: /v1/products?featured=true&page=2&foo=bar <- also returns 7 hits because it ignores foo and page because these two are not in the schema

const getAllProducts = async (req, res) => {
  console.log(req.query); // eg: {featured: 'true'} or { name: 'john', featured: 'true' }
  //   const products = await Product.find(req.query); // req.query is already an object so we don't need to add {}
  const { featured, company, name, sort, fields, numericFilters } = req.query; // we just pull out what property we're interested in from the req.query
  // console.log(req.query);
  // console.log(featured);
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

  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    // the second parameter in replace() is a function. The function will be invoked multiple times for each full match to be replaced if the regular expression in the first parameter is global.
    // here, if there's a match i.e '>', it will return `-$gt-`
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    console.log(filters);
    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        // check if 'price' or 'rating' is included in options
        // console.log(field, operator, value);
        // have to use [] for operator variable to set the property dynamically based on the value of the variable `operator`
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  console.log(queryObject);
  let result = Product.find(queryObject);
  // console.log(result);
  // SORT
  if (sort) {
    // console.log(sort); // prints name, -price
    const sortList = sort.split(',').join(' '); // we want to remove the comma -> split by the comma then join them by a white space
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt');
  }
  // SELECT
  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }
  // PAGINATION
  const page = Number(req.query.page) || 1; // if no page is passed -> set it to 1
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  // eg: 23 records in total. Limit: 7 -> 4 pages (7,7,7,2). If user clicks on page 3 -> skip = 14
  result = result.skip(skip).limit(limit);

  const products = await result;
  // console.log(products);
  // const products = await Product.find(queryObject); // if queryObject is an empty {} => return all products.
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts1 = async (req, res) => {
  console.log(req.query);
  const { featured, company, name, sort, fields } = req.query;
  const queryObject = {};
  // featured
  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }
  // company
  if (company) {
    queryObject.company = company;
  }
  // name
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }
  console.log(queryObject);
  let result = product.find(queryObject);

  // sort
  if (sort) {
    let sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt');
  }
  // fields (SELECT)
  if (fields) {
    let fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }
  // Pagination
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProductsStatic, getAllProducts };
