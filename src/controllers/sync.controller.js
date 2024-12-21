import { getActiveAccounts } from '../services/xero.service.js';
import { syncCategories } from '../services/actual.service.js';

export async function syncXeroAccounts(req, res) {
  try {
    const accounts = await getActiveAccounts();
    await syncCategories(accounts);
    res.json({ 
      success: true, 
      message: 'Categories synced successfully',
      count: accounts.length 
    });
  } catch (error) {
    console.error('Error syncing categories:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}