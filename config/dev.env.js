'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
   BASE_API: '"http://localhost:18000/mall-admin"'
   //BASE_API: '"http://localhost:8201/mall-admin"'
  //BASE_API: '"https://admin-api.macrozheng.com"'
})
