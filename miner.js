

class Miner {
    constructor(bockchain, transactionPool, wallet, p2pServer){
        this.bockchain = bockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    mine (){
        const validTransactions = this.transactionPool.validTransactions();
        validTransactions.push(
            Tranaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
        );
        const block = this.blockchain.addBlock(validTransactions);
        this.p2pServer.syncChains();
        this.transactionPool.clear();
        this.p2pServer.broadcastClearTransaction();

        return block;
    }
}

module.exports = Miner;