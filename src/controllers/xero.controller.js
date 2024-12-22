import { xero } from '../config/xero.js';

export async function connectXero(req, res) {
  try {
    // Generate a random state value
    const state = Math.random().toString(36).substring(7);

    // Store it in session or pass it through
    const consentUrl = await xero.buildConsentUrl({
      state: state
    });

    console.log('Redirecting to Xero consent URL with state:', state);
    res.redirect(consentUrl);
  } catch (error) {
    console.error('Error redirecting to Xero:', error);
    res.status(500).send('Failed to redirect to Xero login');
  }
}

export async function handleCallback(req, res) {
  try {
    const { code, state } = req.query;
    console.log('Received callback with:', {
      code: code?.substring(0, 10) + '...',
      state
    });

    if (!code) {
      console.error('No authorization code received from Xero');
      throw new Error('No authorization code received');
    }

    console.log('Attempting to exchange code for token...');

    // Pass the state back in the callback
    const tokenSet = await xero.apiCallback(req.url, {
      state: state
    });

    if (!tokenSet) {
      throw new Error('No token set returned from Xero');
    }

    console.log('Token set received:', {
      hasAccessToken: !!tokenSet.access_token,
      hasRefreshToken: !!tokenSet.refresh_token,
      expiresIn: tokenSet.expires_in
    });

    if (!tokenSet.access_token) {
      throw new Error('Access token is undefined in token set');
    }

    // Store the token
    xero.setTokenSet(tokenSet);

    // Redirect back to home
    res.redirect('/');
  } catch (error) {
    console.error('Error during Xero callback:', error);

    // Enhanced error response
    res.status(500).json({
      error: 'Failed to complete Xero authentication',
      details: error.message,
      errorType: error.constructor.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

export async function getAccounts(req, res) {
  try {
    if (!xero.tokenSet?.access_token) {
      return res.status(401).json({
        error: 'Not authenticated with Xero',
        details: 'Please connect to Xero first'
      });
    }

    console.log('Retrieving Xero accounts...');
    const tenants = await xero.updateTenants();

    if (!tenants || tenants.length === 0) {
      throw new Error('No Xero organizations found');
    }

    const firstTenant = tenants[0];
    console.log('Using organization:', firstTenant.tenantName);

    const response = await xero.accountingApi.getAccounts(firstTenant.tenantId);
    console.log(`Retrieved ${response.body.accounts?.length || 0} accounts`);

    res.json(response.body.accounts);
  } catch (error) {
    console.error('Error fetching Xero accounts:', error);
    res.status(500).json({
      error: 'Failed to fetch Xero accounts',
      details: error.message
    });
  }
}