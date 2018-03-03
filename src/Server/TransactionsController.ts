import BaseController from './BaseController';
import { blockChainInstance } from '../BlockChain';
import { flatMap } from '../utils';

class TransactionsController extends BaseController {
  index(ctx) {
    ctx.response.body = flatMap(blockChainInstance.blocks, block => block.transactions);
  }

  show(ctx) {
    const id = ctx.params.id;
    ctx.response.body = flatMap(blockChainInstance.blocks, block => block.transactions)
      .find(transaction => transaction.id == id);
  }
}

export default TransactionsController;