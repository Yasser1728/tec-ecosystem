import { prisma } from './db/prisma';

class PiSDK {
  constructor() {
    this.initialized = false;
    this.user = null;
  }

  async init() {
    if (typeof window === 'undefined' || !window.Pi) {
      throw new Error('Pi Browser required');
    }

    await window.Pi.init({
      version: "2.0",
      sandbox: process.env.PI_SANDBOX_MODE === 'true'
    });
    
    this.initialized = true;
    return true;
  }

  async authenticate(scopes = ['username', 'payments']) {
    if (!this.initialized) await this.init();

    try {
      const auth = await window.Pi.authenticate(scopes, (payment) => {
        console.log('Incomplete payment:', payment);
      });

      this.user = {
        piId: auth.user.uid,
        username: auth.user.username,
        walletAddress: auth.user.wallet_address
      };

      await this.syncUser();

      return { success: true, user: this.user };
    } catch (error) {
      console.error('Auth failed:', error);
      return { success: false, error: error.message };
    }
  }

  async createPayment({ amount, memo, domain = 'tec' }) {
    if (!this.user) throw new Error('Must authenticate first');

    try {
      const paymentRecord = await prisma.payment.create({
        data: {
          userId: this.user.piId,
          amount,
          currency: 'PI',
          domain,
          description: memo,
          status: 'PENDING'
        }
      });

      const payment = await window.Pi.createPayment({
        amount,
        memo,
        metadata: { internalId: paymentRecord.id }
      }, {
        onReadyForServerApproval: (id) => this.approvePayment(id, paymentRecord.id),
        onReadyForServerCompletion: (id, tx) => this.completePayment(id, tx, paymentRecord.id),
        onCancel: () => this.cancelPayment(paymentRecord.id),
        onError: (err) => this.errorPayment(err, paymentRecord.id)
      });

      return { success: true, paymentId: payment.identifier };
    } catch (error) {
      console.error('Payment failed:', error);
      return { success: false, error: error.message };
    }
  }

  async syncUser() {
    const user = await prisma.user.upsert({
      where: { piId: this.user.piId },
      update: {
        username: this.user.username,
        walletAddress: this.user.walletAddress,
        lastLoginAt: new Date()
      },
      create: {
        piId: this.user.piId,
        username: this.user.username,
        walletAddress: this.user.walletAddress
      }
    });
    return user;
  }

  async approvePayment(paymentId, internalId) {
    await fetch('/api/payments/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, internalId })
    });
  }

  async completePayment(paymentId, txid, internalId) {
    await fetch('/api/payments/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, txid, internalId })
    });
  }

  async cancelPayment(internalId) {
    await prisma.payment.update({
      where: { id: internalId },
      data: { status: 'CANCELLED' }
    });
  }

  async errorPayment(error, internalId) {
    await prisma.payment.update({
      where: { id: internalId },
      data: { status: 'FAILED', metadata: { error: error.message } }
    });
  }

  async checkSessionStatus(piId) {
    try {
      const response = await fetch('/api/auth/session-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ piId: piId || this.user?.piId })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Session status check failed:', error);
      return { success: false, sessionValid: false, error: error.message };
    }
  }
}

export const piSDK = new PiSDK();
