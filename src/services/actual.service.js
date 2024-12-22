import actual from '@actual-app/api';
import dotenv from 'dotenv';
import { join } from 'path';
dotenv.config();

let initialized = false;

// Define a platform-compatible data directory
const dataDir = join(process.cwd(), 'data');

export async function initializeActual() {
  if (!initialized) {
    await actual.init({
      dataDir: dataDir, // Local directory for budget data
      serverURL: process.env.ACTUAL_SERVER_URL, // URL of the Actual Budget server
      password: process.env.ACTUAL_PASSWORD, // Password for the Actual server
    });

    // Download the budget using ACTUAL_SYNC_ID and encryption key
    const syncId = process.env.ACTUAL_SYNC_ID;
    if (!syncId) {
      throw new Error('ACTUAL_SYNC_ID is not defined in .env');
    }

    const encryptionKey = process.env.ACTUAL_ENCRYPTION_KEY;
    await actual.downloadBudget(syncId, encryptionKey ? { password: encryptionKey } : {});
    initialized = true;
  }
}

export async function getActualCategories() {
  try {
    await initializeActual();
    const categories = await actual.getCategories();
    return categories;
  } catch (error) {
    console.error('Error fetching Actual categories:', error);
    throw error;
  }
}

export async function syncCategories(mappings) {
  try {
    await initializeActual();
    for (const mapping of mappings) {
      await actual.updateCategory(mapping.actualCategoryId, {
        xeroAccountId: mapping.xeroAccountId,
      });
    }
    console.log('Categories synced successfully');
  } catch (error) {
    console.error('Error syncing categories:', error);
    throw error;
  }
}
