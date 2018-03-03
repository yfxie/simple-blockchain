import Block, { genesisBlock } from './Block';
import { getCurrentTimestamp, flatMap } from './utils';
import Transaction, { UTxOut } from "./Transaction";

const BLOCK_GENERATION_INTERVAL: number = 10;
const DIFFICULTY_ADJUSTMENT_INTERVAL: number = 10;

class BlockChain {
  public readonly blocks: Block[] = [genesisBlock];
  public uTxOuts: UTxOut[] = [];
  public readonly tPool: Transaction[] = [];

  constructor() {
    this.updateUTxOuts(this.blocks[0]);
  }

  get latestBlock():Block {
    return this.blocks[this.blocks.length - 1];
  }

  get nextDifficulty():number {
    const length = this.blocks.length;
    const latestBlock = this.latestBlock;

    if (latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && latestBlock != genesisBlock) {
      const timeExpected: number = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL;
      const timeTaken: number = latestBlock.timestamp - this.blocks[length - DIFFICULTY_ADJUSTMENT_INTERVAL].timestamp;
      if (timeTaken < timeExpected / 2) {
        return latestBlock.difficulty + 1
      } else if (timeTaken > timeExpected * 2) {
        return latestBlock.difficulty - 1;
      } else {
        return latestBlock.difficulty;
      }
    } else {
      return latestBlock.difficulty;
    }
  }

  addTransactionToPool(transaction: Transaction) {
    this.tPool.push(transaction);
  }

  getTransactionFromPool():Transaction[] {
    return this.tPool;
  }

  addBlock(block:Block):boolean {
    this.blocks.push(block);
    this.updateUTxOuts(block);
    return true;
  }

  getNextPuzzleBlock(address: string):Block {
    const previousBlock:Block = this.latestBlock;
    const nextDifficulty:number = this.nextDifficulty;
    const nextIndex:number = previousBlock.index + 1;
    const nextTimestamp:number = getCurrentTimestamp();

    const coinBaseTx: Transaction = Transaction.createCoinBaseTx(nextIndex, address);
    const transactions: Transaction[] = [coinBaseTx].concat(this.getTransactionFromPool());

    return new Block({
      index: nextIndex,
      hash: '',
      previousHash: previousBlock.hash,
      timestamp: nextTimestamp,
      difficulty: nextDifficulty,
      transactions,
      nonce: 1
    });
  }

  updateUTxOuts(block: Block) {
    const newTx = block.transactions;

    /* 新交易(out)不可能在當下區塊被使用到 */
    const newUTxOuts = flatMap(newTx, (t: Transaction) =>
      t.txOuts.map((txOut, index) => new UTxOut(t.id, index, txOut.address, txOut.amount)));


    /* 新交易(in)必使用到之前的 uTxOut */
    const newTxIns = flatMap(newTx, (t: Transaction) => t.txIns);

    const oldUTxOuts = this.uTxOuts.filter(uTxO =>
      !newTxIns.find(txIn => txIn.txId == uTxO.txId && txIn.txOutIndex == uTxO.txOutIndex)
    );

    this.uTxOuts = oldUTxOuts.concat(newUTxOuts);
  }
}

export const blockChainInstance = new BlockChain();
export default BlockChain;

