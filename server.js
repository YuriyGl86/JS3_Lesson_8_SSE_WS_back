const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body').default;
const WS = require('ws');

const router = require('./routes');

const app = new Koa();

app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));

app.use(async (ctx, next) => { // eslint-disable-line consistent-return
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*' };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});

// TODO: write code here

app.use(router());

const port = 7071;
const server = http.createServer(app.callback());

const wsServer = new WS.Server({
  server,
});

const chat = ['welcome to our chat'];

wsServer.on('connection', (ws) => {
  ws.on('message', (message) => {
    // console.log('ws message ', message.toString())
    // console.log('type', typeof message)
    const { messageText, date, user } = JSON.parse(message.toString());
    const newMessage = { messageText, date, user };
    chat.push(newMessage);
    console.log('сообщение', messageText, date, user);

    const eventData = JSON.stringify({ chat: [newMessage] });

    Array.from(wsServer.clients)
      .filter((client) => client.readyState === WS.OPEN)
      .forEach((client) => client.send(eventData));
  });

  ws.send(JSON.stringify({ chat }));
});

server.listen(port);
