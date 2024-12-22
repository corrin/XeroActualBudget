import pkg from '@actual-app/api';
const { ActualAPI } = pkg;

let actual = null;

export async function initializeActual() {
  if (!actual) {
    actual = new ActualAPI();
    await actual.init({
      serverURL: process.env.ACTUAL_SERVER_URL || 'http://localhost:5006',
      password: process.env.ACTUAL_PASSWORD
    });
  }
  return actual;
}

export async function getActualCategories() {
  const actual = await initializeActual();
  const categories = await actual.getCategories();
  return categories.map(category => ({
    id: category.id,
    name: category.name,
    type: category.type,
    group: category.group
  }));
}

export async function syncCategories(mappings) {
  const actual = await initializeActual();

  for (const mapping of mappings) {
    try {
      await actual.updateCategory({
        id: mapping.actualCategoryId,
        metadata: {
          xeroAccountId: mapping.xeroAccountId
        }
      });
    } catch (error) {
      console.error(`Failed to update category ${mapping.actualCategoryId}:`, error);
      throw error;
    }
  }
}