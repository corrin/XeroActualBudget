import { getActualCategories } from '../services/actual.service.js';
import { saveActualCategory } from '../db/index.js';

export async function getCategories(req, res) {
  try {
    const categories = await getActualCategories(); // Fetch from Actual API

    // Save categories to the database
    categories.forEach(category => {
      saveActualCategory({
        id: category.id,
        name: category.name,
        group_name: category.group || null
      });
    });

    res.json(categories);
  } catch (error) {
    console.error('Error fetching Actual categories:', error);
    res.status(500).json({ error: error.message });
  }
}
