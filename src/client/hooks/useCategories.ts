import { useState, useEffect } from 'react';
import { fetchXeroAccounts, fetchActualCategories } from '../services/api';
import { XeroAccount, ActualCategory } from '../types';

export function useCategories() {
  const [xeroAccounts, setXeroAccounts] = useState<XeroAccount[]>([]);
  const [actualCategories, setActualCategories] = useState<ActualCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const [accounts, categories] = await Promise.all([
          fetchXeroAccounts(),
          fetchActualCategories()
        ]);
        setXeroAccounts(accounts);
        setActualCategories(categories);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load categories'));
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, []);

  return { xeroAccounts, actualCategories, isLoading, error };
}