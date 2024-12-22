import actual from '@actual-app/api';
import dotenv from 'dotenv';
import { join } from 'path';
import fs from 'fs';
dotenv.config();

let initialized = false;
const BUDGET_ID = 'My-Finances-b564632';

// Define a platform-compatible data directory
const dataDir = join(process.cwd(), 'data');

async function ensureBudgetDirectory() {
  const budgetDir = join(dataDir, BUDGET_ID);
  if (!fs.existsSync(budgetDir)) {
    fs.mkdirSync(budgetDir, { recursive: true });
  }

  // Create a basic prefs.json if it doesn't exist
  const prefsPath = join(budgetDir, 'prefs.json');
  if (!fs.existsSync(prefsPath)) {
    const prefs = {
      id: BUDGET_ID,
      groupId: process.env.ACTUAL_SYNC_ID,
      encryptKeyId: process.env.ACTUAL_ENCRYPTION_KEY ? '1' : null,
      cloudFileId: process.env.ACTUAL_SYNC_ID
    };
    fs.writeFileSync(prefsPath, JSON.stringify(prefs, null, 2));
  }

  return budgetDir;
}

export async function initializeActual() {
  if (!initialized) {
    console.log('Initializing Actual Budget connection...');

    try {
      // Ensure budget directory exists with prefs
      const budgetDir = await ensureBudgetDirectory();
      console.log('Budget directory:', budgetDir);

      console.log('Initializing API with:', {
        dataDir,
        serverURL: process.env.ACTUAL_SERVER_URL,
        budgetId: BUDGET_ID
      });

      // Initialize the API
      await actual.init({
        dataDir,
        serverURL: process.env.ACTUAL_SERVER_URL,
        password: process.env.ACTUAL_PASSWORD,
        timeout: 30000
      });
      console.log('Successfully initialized Actual Budget API');

      // Download the budget
      try {
        const syncId = process.env.ACTUAL_SYNC_ID;
        if (!syncId) {
          throw new Error('ACTUAL_SYNC_ID is not defined in .env');
        }

        console.log('Downloading budget...');
        const options = process.env.ACTUAL_ENCRYPTION_KEY
          ? { password: process.env.ACTUAL_ENCRYPTION_KEY }
          : {};

        await actual.downloadBudget(syncId, options);
        console.log('Successfully downloaded budget');

        // Try to load it
        await actual.loadBudget(BUDGET_ID);
        console.log('Successfully loaded budget');

      } catch (error) {
        console.error('Error during budget setup:', error);
        throw error;
      }

      initialized = true;
    } catch (error) {
      console.error('Failed to initialize Actual Budget:', {
        error: error.message,
        stack: error.stack,
        name: error.name,
        details: error.details || 'No additional details'
      });
      throw error;
    }
  }

  return true;
}

export async function getActualCategories() {
  try {
    console.log('Getting Actual Budget categories...');
    await initializeActual();
    const categories = await actual.getCategories();
    console.log('Successfully retrieved categories:', categories);
    return categories;
  } catch (error) {
    console.error('Error fetching Actual categories:', error);
    throw error;
  }
}

export async function syncCategories(mappings) {
  try {
    console.log('Starting category sync...');
    await initializeActual();
    for (const mapping of mappings) {
      console.log(`Syncing mapping: ${mapping.actualCategoryId} -> ${mapping.xeroAccountId}`);
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