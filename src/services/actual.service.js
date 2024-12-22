import actual from '@actual-app/api';
import { join } from 'path';

let initialized = false;

// Define a platform-compatible data directory
const dataDir = join(process.cwd(), 'data'); // Resolves to "<current_working_directory>/data"

// Initialize the Actual API
export async function initializeActual() {
  if (!initialized) {
    await actual.init({
      dataDir: dataDir,
    });
    initialized = true;
  }
}

// Fetch categories from Actual Budget
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

// Sync categories based on mappings
export async function syncCategories(mappings) {
  try {
    await initializeActual();
    for (const mapping of mappings) {
      await actual.updateCategory(mapping.actualCategoryId, {
        xeroAccountId: mapping.xeroAccountId,
      });
    }
  } catch (error) {
    console.error('Error syncing categories:', error);
    throw error;
  }
}
