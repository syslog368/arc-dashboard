import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server-authoritative state for the demo escrow
  let activeEscrowState = {
    status: 'idle',
    amount: '100.00',
    jobId: 'ARC-JOB-0921-X',
    evaluator: '0xEval44kP928z8rX',
    beneficiary: '0xAgentArbitrage9921F4x',
    lastUpdate: new Date().toISOString()
  };

  // --- API Routes ---

  // Get active escrow status for polling
  app.get('/api/escrow-status', (req, res) => {
    res.json(activeEscrowState);
  });

  // Action endpoint to change escrow state
  app.post('/api/escrow-action', (req, res) => {
    const { action, amount } = req.body;
    
    switch(action) {
      case 'fund':
        activeEscrowState.status = 'funded';
        if (amount) activeEscrowState.amount = amount;
        break;
      case 'execute':
        activeEscrowState.status = 'completed';
        break;
      case 'release':
        activeEscrowState.status = 'released';
        break;
      case 'reset':
        activeEscrowState.status = 'idle';
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    
    activeEscrowState.lastUpdate = new Date().toISOString();
    res.json(activeEscrowState);
  });

  // Health check for frontend verification
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'operational', 
      network: 'Arc Testnet',
      timestamp: new Date().toISOString()
    });
  });

  // Simulator for "real" job escrow data
  app.get('/api/escrows', (req, res) => {
    // This would fetch from a database in a later step
    res.json([
      { id: 'ARC-ESC-0921-X', amount: '1,240.00', status: 'funded', type: 'ERC-8183' },
      { id: 'ARC-ESC-1100-A', amount: '485.12', status: 'completed', type: 'ERC-8183' }
    ]);
  });

  // Escrow Transaction History
  app.get('/api/escrow-history', (req, res) => {
    res.json([
      { 
        id: 'tx_8821', 
        date: '2026-04-16T22:45:00Z', 
        type: 'Funding', 
        amount: '100.00 USDC', 
        address: '0xArc3E...7b9A', 
        txHash: '0x7e...f2a1' 
      },
      { 
        id: 'tx_8822', 
        date: '2026-04-16T22:50:30Z', 
        type: 'Execution', 
        amount: 'v1.4 Evaluator', 
        address: '0xEval...44kP', 
        txHash: '0x3a...d9e8' 
      },
      { 
        id: 'tx_8823', 
        date: '2026-04-16T23:10:15Z', 
        type: 'Release', 
        amount: '100.00 USDC', 
        address: '0xAgent...F4x', 
        txHash: '0x1c...a4b2' 
      }
    ]);
  });

  // --- Vite Middleware ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production assets
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[REAL_LOG] Full-stack engine active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
