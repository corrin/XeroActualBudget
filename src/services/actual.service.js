import actual from '@actual-app/api';
import dotenv from 'dotenv';
import { join } from 'path';
dotenv.config();

let initialized = false;

export async function initializeActual() {
  if (!initialized) {
    try {
      // Step 1: Initialize the API
      await actual.init({
        dataDir: join(process.cwd(), 'data'), // Local directory for cached data
        serverURL: process.env.ACTUAL_SERVER_URL, // URL of the Actual server
        password: process.env.ACTUAL_PASSWORD, // Login password for the server
      });

      // Step 2: Download the budget
      const syncId = process.env.ACTUAL_SYNC_ID;
      if (!syncId) {
        throw new Error('ACTUAL_SYNC_ID is not defined in .env');
      }

      const encryptionKey = process.env.ACTUAL_ENCRYPTION_KEY;
      console.log('Downloading budget with syncId:', syncId);
      await actual.downloadBudget(syncId, encryptionKey ? { password: encryptionKey } : {});
      console.log('Budget downloaded successfully');

      initialized = true;
    } catch (error) {
      console.error('Error initializing Actual API:', error);
      throw error;
    }
  }
}

export async function getActualCategories() {
  try {
    // Ensure the Actual API is initialized
    await initializeActual();

    // Fetch categories
    const categories = await actual.getCategories();
    return categories;
  } catch (error) {
    console.error('Error fetching Actual categories:', error);
    throw error;
  }
}

export async function syncCategories(mappings) {
  try {
    // Ensure the Actual API is initialized
    await initializeActual();

    // Sync categories with mappings
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
