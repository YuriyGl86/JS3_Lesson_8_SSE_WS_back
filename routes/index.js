const combineRouters = require('koa-combine-routers');

const index = require('./index/index');
const users = require('./users/index');
const sse = require('./sse');

const router = combineRouters(
  index,
  users,
  sse,
);

module.exports = router;
