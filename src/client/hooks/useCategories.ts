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
      console.log('Starting to load categories...');
      try {
        console.log('Fetching Xero accounts...');
        const [accounts, categories] = await Promise.all([
          fetchXeroAccounts(),
          fetchActualCategories()
        ]);
        console.log('Received Xero accounts:', accounts);
        console.log('Received Actual categories:', categories);
        setXeroAccounts(accounts);
        setActualCategories(categories);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError(err instanceof Error ? err : new Error('Failed to load categories'));
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, []);

  return { xeroAccounts, actualCategories, isLoading, error };
}