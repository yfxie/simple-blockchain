import Client from './Client';
import Block from './Block';
import Server from './Server';
import { blockChainInstance } from './BlockChain';

const client = new Client();

for(let i = 0; i < 10; i++) {
  const block:Block = client.mine();
  blockChainInstance.addBlock(block);

  console.log(`New block is found! I have $${client.wallet.balance}`);
}

client.sendTransaction('04bfcab8722991ae774db48f934ca79cfb7dd991229153b9f732ba5334aafcd8e7266e47076996b55a14bf9913ee3145ce0cfc1372ada8ada74bd287450313534b',
  30
);

console.log('I sent $30 to someone.');
console.log(`New block has not been found yet. So I still have $${client.wallet.balance}`);

const block:Block = client.mine();
blockChainInstance.addBlock(block);
console.log(`New block was found. I have only $${client.wallet.balance}`);

const server = new Server();
console.log('visit localhost:3000/blocks to see current blockchain');