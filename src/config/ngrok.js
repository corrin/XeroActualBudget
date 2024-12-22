import ngrok from 'ngrok';

export async function setupNgrok() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Ngrok should not be used in production');
  }

  try {
    console.log('Setting up ngrok tunnel...');

    // Connect ngrok with explicit subdomain and region
    const options = {
      addr: process.env.PORT || 3000, // Your server's port
      subdomain: 'xero-actual-budget', // Fixed subdomain
      region: 'au', // Fixed region
    };

    // Start ngrok with the options
    const url = await ngrok.connect(options);

    console.log(`ngrok tunnel established at: ${url}`);
    return url;
  } catch (error) {
    console.error('Error setting up ngrok:', error);
    throw error;
  }
}
