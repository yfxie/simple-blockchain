import BaseController from './BaseController';
import { blockChainInstance } from '../BlockChain';

class BlocksController extends BaseController {
  index(ctx) {
    ctx.response.body = blockChainInstance.blocks;
  }

  show(ctx) {
    const id = ctx.params.id;
    ctx.response.body = blockChainInstance.blocks.find(block => block.hash == id);
  }
}

export default BlocksController;