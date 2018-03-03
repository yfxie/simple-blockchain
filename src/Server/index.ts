import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import router from './router';

import BlocksController from './BlocksController';
import TransactionsController from './TransactionsController';

const controllers = [BlocksController, TransactionsController];
controllers.forEach(Controller => {
  const controller = new Controller();
  controller.applyToRouter(router);
});

class Server {
  private app:Koa;

  constructor(port: number = 3000) {
    this.app = new Koa();
    this.app.use(bodyParser()).use(router.routes()).listen(port);
  }
}

export default Server;