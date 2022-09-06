const express = require('express');
const router = express.Router(); // create a new router object to handle requests

const {
  getAllProducts,
  getAllProductsStatic,
} = require('../controllers/products');

// 'api/v1/products' route. Callback function will be invoked if an Http GET request with the path is received
router.route('/').get(getAllProducts);
// 'api/v1/products/static' route:
router.route('/static').get(getAllProductsStatic);

module.exports = router;
