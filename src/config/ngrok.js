import ngrok from 'ngrok';

export async function setupNgrok() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Ngrok should not be used in production');
  }

  console.log('Setting up ngrok tunnel...');
  return await ngrok.connect({
    addr: process.env.PORT || 3000,
    subdomain: 'xero-actual-budget',
    region: 'au'
  });
}