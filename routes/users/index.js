const Router = require('koa-router');
const users = require('../../db/db');

const router = new Router();

router.post('/users', (ctx) => {
  console.log(typeof ctx.request.body);
  console.log(ctx.request.body);

  //  = 'user name is correct';

  const { name } = ctx.request.body;

  ctx.response.set('Access-Control-Allow-Origin', '*');

  if (users.data.some((userName) => userName === name)) {
    ctx.response.status = 400;
    ctx.response.body = { status: 'not a unique username' };

    return;
  }

  users.add(name);

  ctx.response.body = { status: 'OK' };
});

router.delete('/users/:name', (ctx) => {
  const { name } = ctx.params;

  ctx.response.set('Access-Control-Allow-Origin', '*');

  // if (subsriptions.data.every(sub => sub.phone !== phone)) {
  //   ctx.response.status = 400;
  //   ctx.response.body = { status: "subscriprion doesn\'t exists" };

  //   return;
  // }

  users.del(name);

  ctx.response.body = { status: 'OK' };
});

router.get('/userlist', (ctx) => {
  console.log(typeof ctx.request.body);
  console.log(ctx.request.body);

  ctx.response.set('Access-Control-Allow-Origin', '*');

  ctx.response.body = JSON.stringify(users.data);
});

module.exports = router;
