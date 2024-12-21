import ngrok from 'ngrok';
import dotenv from 'dotenv';

dotenv.config();

export async function setupNgrok() {
  try {
    const url = await ngrok.connect({
      addr: process.env.PORT || 3000,
      region: 'us'
    });
    console.log('Ngrok tunnel established:', url);
    return url;
  } catch (error) {
    console.error('Error setting up ngrok:', error);
    throw error;
  }
}