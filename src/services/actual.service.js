// src/services/actual.service.js

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

// src/services/actual.service.js
export async function getActualCategories() {
  try {
    await initializeActual();
    const categories = await actual.getCategories();
    const groups = await actual.getCategoryGroups();

    // Join categories with their group names
    return categories.map(cat => ({
      ...cat,
      group: groups.find(g => g.id === cat.group_id)?.name || 'Ungrouped'
    }));
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

export async function syncJournals(journals, mappings) {
  try {
    console.log('Starting journal sync...');
    await initializeActual();

    for (const journal of journals) {
      for (const line of journal.journalLines) {
        const actualCategoryId = mappings[line.accountId];
        if (actualCategoryId) {
          const amount = line.creditAmount - line.debitAmount;
          const date = new Date(journal.journalDate).toISOString().split('T')[0];
          const description = journal.narration || 'Xero Journal';

          console.log(`Creating transaction for journal ${journal.journalNumber}, account ${line.accountCode}: ${amount}`);
          await actual.createTransaction({
            account: actualCategoryId,
            amount,
            date,
            description,
          });
        } else {
          console.warn(`No mapping found for Xero account code: ${line.accountCode}`);
        }
      }
    }

    console.log('Journals synced successfully');
  } catch (error) {
    console.error('Error syncing journals:', error);
    throw error;
  }
}