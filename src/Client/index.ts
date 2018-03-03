import Block from '../Block';
import { blockChainInstance } from '../BlockChain';
import { getCurrentTimestamp, hex2Binary } from '../utils';
import Transaction, { TxOut, TxIn } from '../Transaction';
import Wallet from './Wallet';

class Client {
  public readonly wallet: Wallet;

  constructor() {
    this.wallet = new Wallet();
  }

  sendTransaction(address: string, amount: number) {
    const { uTxOuts, value } = this.wallet.collectUTxOutsToFitAmount(amount);
    const txOuts = [new TxOut(address, amount)];

    if (value > amount) {
      txOuts.push(new TxOut(this.wallet.address, value - amount));
    }

    const transaction = new Transaction();
    transaction.txIns = uTxOuts.map(uTxOut => {
      const txIn = new TxIn();
      txIn.txOutIndex = uTxOut.txOutIndex;
      txIn.txId = uTxOut.txId;
      return txIn;
    });
    transaction.txOuts = txOuts;
    transaction.generateId();
    transaction.sign(this.wallet.privateKey);

    blockChainInstance.addTransactionToPool(transaction);
  }

  mine():Block {
    const address:string = this.wallet.address;
    const block:Block = blockChainInstance.getNextPuzzleBlock(address);
    const start = getCurrentTimestamp();
    block.findSolution();
    const duration:number = getCurrentTimestamp() - start;
    console.log(`block found! Difficulty: ${block.difficulty}, duration: ${duration}`);

    return block;
  };
}

export default Client;