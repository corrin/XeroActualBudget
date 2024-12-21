import { ActualBudget } from 'actual-budget';

let actual = null;

export async function initializeActual() {
  if (!actual) {
    actual = new ActualBudget();
    await actual.init();
  }
  return actual;
}

export async function getActualCategories() {
  const actual = await initializeActual();
  return actual.getCategories();
}

export async function syncCategories(mappings) {
  const actual = await initializeActual();
  
  for (const mapping of mappings) {
    // Update or create category based on mapping
    await actual.updateCategory(mapping.actualCategoryId, {
      xeroAccountId: mapping.xeroAccountId
    });
  }
}