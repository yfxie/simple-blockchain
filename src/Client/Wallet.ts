import * as path from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { ec } from 'elliptic';
import { blockChainInstance } from '../BlockChain';
import {UTxOut} from "../Transaction";

const EC = new ec('secp256k1');
const privateKeyLocation = path.join(__dirname, '../../secret/privateKey');

class Wallet {
  public privateKey:string;

  constructor() {
    this.initWallet();
  }

  get address() {
    const key = EC.keyFromPrivate(this.privateKey, 'hex');
    return key.getPublic().encode('hex');
  }

  get unspendTxOuts(): UTxOut[] {
    return blockChainInstance.uTxOuts
      .filter(out => out.address == this.address);
  }

  get balance(): number {
    return this.unspendTxOuts.map(out => out.amount).reduce((a, b) => a + b);
  }

  collectUTxOutsToFitAmount(amount: number): { uTxOuts: UTxOut[], value: number} {
    let value = 0;
    const uTxOuts:UTxOut[] = [];

    for(const out of this.unspendTxOuts) {
      uTxOuts.push(out);
      value += out.amount;

      if (value >= amount) {
        return { uTxOuts, value };
      }
    }
    throw Error(`it requires ${amount}, but only ${value} is available.`);
  }

  private initWallet() {
    if(!existsSync(privateKeyLocation)) {
      const keyPair = EC.genKeyPair();
      const privateKey = keyPair.getPrivate().toString(16);
      this.privateKey = privateKey;
      writeFileSync(privateKeyLocation, privateKey);
    } else {
      this.privateKey = readFileSync(privateKeyLocation, 'utf8').toString();
    }
  }
}

export default Wallet;