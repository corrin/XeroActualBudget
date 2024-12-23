import { getAllXeroAccounts, getAllActualCategories, getAllMappings } from '../db/index.js';

export async function syncXeroAccounts(req, res) {
  try {
    console.log('Starting sync...');
    const xeroAccounts = getAllXeroAccounts();
    const actualCategories = getAllActualCategories();
    const mappings = getAllMappings();

    console.log('Sync data:', { xeroAccounts, actualCategories, mappings });

    // Your sync logic here...

    res.json({ success: true });
  } catch (error) {
    console.error('Error during sync:', error);
    res.status(500).json({ error: error.message });
  }
}
