import * as Crypto from 'crypto-js';
import Transaction from './Transaction';
import { blockChainInstance } from './BlockChain';
import { getCurrentTimestamp, hex2Binary } from './utils';

class Block {
  public index: number;
  public hash: string;
  public previousHash: string;
  public timestamp: number;
  public transactions: Transaction[];
  public difficulty: number;
  public nonce: number;

  constructor(obj: Object) {
    ['index', 'hash', 'previousHash', 'timestamp', 'transactions', 'difficulty', 'nonce'].forEach(k => {
      if (typeof obj[k] === 'undefined') {
        throw Error(`block attribute ${k} is not defined`)
      }
      this[k] = obj[k];
    });
  }

  findSolution(): string {
    let nonce = this.nonce, hash: string, binary: string;
    const solutionPrefix = '0'.repeat(this.difficulty);

    while(true) {
      if (nonce % 1000000 == 0) {
        console.log('1MB tries');
      }
      hash = Block.calculateHash(
        this.index, this.previousHash,
        this.timestamp, this.transactions, this.difficulty, nonce++);
      binary = hex2Binary(hash);

      if (binary.startsWith(solutionPrefix)) {
        return this.hash = hash;
      }
    }
  }

  static calculateHash(
    index: number, previousHash: string, timestamp: number, transactions: Transaction[],
    difficulty: number, nonce: number,
  ):string {
    const input = `${index}${previousHash}${timestamp}${transactions}${difficulty}${nonce}`;
    return Crypto.SHA256(input).toString();
  }
}

export const genesisBlock: Block = new Block({
  index: 0, hash: '', previousHash: 'a048d5df90ede1c9d21375010f4fdbe35d3ff7978c36745304f4b72126db98cd', timestamp: 1465154705, transactions: [], difficulty: 0, nonce: 0
});

// used to calculate genesisBlock hash
// console.log(Block.calculateHash(
//   genesisBlock.index, genesisBlock.previousHash,
//   genesisBlock.timestamp, genesisBlock.transactions, genesisBlock.difficulty, genesisBlock.nonce)
// );

export default Block;
