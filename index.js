const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain/blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../blockchain/wallet/index');
const TransactionPool = require('../blockchain/wallet/transaction-pool');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pserver = new P2pServer(bc, tp);

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
   res.json(bc.chain);
});

app.post('/mine', (req,res) => {
   const block = bc.addBlock(req.body.data);
   console.log(`New block was added: ${block.toString()}`);

   p2pserver.syncChains();

   res.redirect('/blocks');
})

app.get('/transactions', (req, res) => {
   res.json(tp.transactions);
});

app.post('/transactions', (req,res) => {

   const { recipient, amount} = req.body;
   const transaction = wallet.createTransaction(recipient, amount, tp);

   p2pserver.broadcastTransaction(transaction);

   res.redirect('/transactions');

})

app.get('/public-key', (req, res) => {
   res.json( {publicKey: wallet.publicKey });
})

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pserver.listen();