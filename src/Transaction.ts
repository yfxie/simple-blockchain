import * as CryptoJS from 'crypto-js';
import { ec } from 'elliptic';
import { binary2Hex } from './utils';

const EC = new ec('secp256k1');

const COIN_BASE_AMOUNT: number = 10;

class Transaction {
  public id: string;
  public txIns:TxIn[];
  public txOuts:TxOut[];

  static createCoinBaseTx(blockIndex: number, address: string): Transaction {
    const transaction = new Transaction();
    const txIn:TxIn = new TxIn();
    txIn.signature = '';
    txIn.txId = '';
    txIn.txOutIndex = blockIndex;

    const txOut:TxOut = new TxOut(address, COIN_BASE_AMOUNT);

    transaction.txIns = [txIn];
    transaction.txOuts = [txOut];

    transaction.generateId();

    return transaction;
  }

  sign(privateKey: string) {
    const key = EC.keyFromPrivate(privateKey, 'hex');
    const signature:string = binary2Hex(key.sign(this.id).toDER());

    this.txIns.forEach(txIn => {
      txIn.signature = signature;
    });
  }

  generateId():string {
    const txInStr:string = this.txIns.map(txIn => txIn.txId + txIn.txOutIndex).join();
    const txOutStr:string = this.txOuts.map(txOut => txOut.address + txOut.amount).join();
    return this.id = CryptoJS.SHA256(txInStr + txOutStr).toString();
  }
}

export class TxIn {
  public txId: string;
  public txOutIndex: number;
  public signature: string;
}

export class TxOut {
  public address: string;
  public amount: number;

  constructor(address: string, amount: number) {
    this.address = address;
    this.amount = amount;
  }
}

export class UTxOut {
  public readonly txId: string;
  public readonly txOutIndex: number;
  public readonly address: string;
  public readonly amount: number;

  constructor(txId: string, txOutIndex: number, address: string, amount: number) {
    this.txId = txId;
    this.txOutIndex = txOutIndex;
    this.address = address;
    this.amount = amount;
  }
}
export default Transaction;