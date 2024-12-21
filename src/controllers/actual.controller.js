import { getActualCategories } from '../services/actual.service.js';

export async function getCategories(req, res) {
  try {
    const categories = await getActualCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching Actual categories:', error);
    res.status(500).json({ error: error.message });
  }
}