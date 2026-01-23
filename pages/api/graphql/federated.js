/**
 * GraphQL Federation API Endpoint
 * Provides GraphQL gateway for federated queries
 * 
 * @route POST /api/graphql/federated
 */

import { graphqlFederation } from '../../../lib/graphql/federation.js';
import { zeroTrust } from '../../../lib/security/zero-trust.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ['POST']
    });
  }

  try {
    // Zero-Trust verification
    const verification = await zeroTrust.verifyRequest({
      sessionId: req.cookies?.sessionId,
      userId: req.session?.user?.id,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      headers: req.headers,
      endpoint: '/api/graphql/federated',
      resource: 'graphql',
      action: 'query',
      domain: 'nexus'
    });

    if (!verification.passed) {
      return res.status(403).json({
        error: 'Access denied',
        reason: verification.results.find(r => !r.passed)?.reason,
        riskScore: verification.riskScore
      });
    }

    const { query, variables } = req.body;

    if (!query) {
      return res.status(400).json({
        error: 'GraphQL query is required'
      });
    }

    // Execute federated query
    const result = await graphqlFederation.executeQuery(
      query,
      variables || {},
      {
        authorization: req.headers.authorization,
        userId: req.session?.user?.id,
        domain: req.headers['x-domain']
      }
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error('GraphQL Federation Error:', error);
    return res.status(500).json({
      errors: [{ message: 'Internal server error', extensions: { code: 'INTERNAL_ERROR' } }],
      data: null
    });
  }
}
