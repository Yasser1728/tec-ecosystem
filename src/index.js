const express = require('express');
const { ethers } = require('ethers');
const app = express();
app.use(express.json());

// Bug 1: No error handling
app.get('/balance/:address', async (req, res) => {
  const provider = new ethers.providers.JsonRpcProvider('https://eth.llamarpc.com');
  const balance = await provider.getBalance(req.params.address);
  res.json({ balance: ethers.utils.formatEther(balance) });
});

// Bug 2: Missing async
app.get('/block', (req, res) => {
  const provider = new ethers.providers.JsonRpcProvider('https://eth.llamarpc.com');
  const num = provider.getBlockNumber();
  res.json({ block: num });
});

// Bug 3: No input validation
app.post('/send', async (req, res) => {
  const wallet = new ethers.Wallet(req.body.key);
  const tx = await wallet.sendTransaction({
    to: req.body.to,
    value: ethers.utils.parseEther(req.body.amount)
  });
  res.json({ hash: tx.hash });
});

app.listen(3000);
