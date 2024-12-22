import React, { useState, useEffect } from 'react';
import { CategoryMapper } from './components/CategoryMapper';
import { useCategories } from './hooks/useCategories';
import { saveMappings } from './services/api';
import { CategoryMapping } from './types';

export default function App() {
  const { xeroAccounts, actualCategories, isLoading, error } = useCategories();
  const [mappings, setMappings] = useState<CategoryMapping[]>([]);

  // Load existing mappings
  useEffect(() => {
    async function loadMappings() {
      try {
        const response = await fetch('/api/mappings');
        if (!response.ok) {
          throw new Error('Failed to load existing mappings');
        }
        const existingMappings = await response.json();
        setMappings(existingMappings.map(m => ({
          xeroAccountId: m.xero_account_id,
          actualCategoryId: m.actual_category_id
        })));
      } catch (error) {
        console.error('Error loading mappings:', error);
      }
    }

    loadMappings();
  }, []);

  // Automatically redirect to Xero auth if not authenticated
  useEffect(() => {
    if (error?.message?.includes('Not authenticated with Xero')) {
      window.location.href = '/api/xero/connect';
    }
  }, [error]);

  const handleMappingChange = (xeroAccountId: string, actualCategoryId: string) => {
    setMappings(prev => {
      const existing = prev.findIndex(m => m.xeroAccountId === xeroAccountId);
      if (existing >= 0) {
        return [
          ...prev.slice(0, existing),
          { xeroAccountId, actualCategoryId },
          ...prev.slice(existing + 1)
        ];
      }
      return [...prev, { xeroAccountId, actualCategoryId }];
    });
  };

  const handleSave = async () => {
    try {
      await saveMappings(mappings);
      alert('Mappings saved successfully!');
    } catch (error) {
      alert('Failed to save mappings');
      console.error('Save error:', error);
    }
  };

  // Show loading state
  if (isLoading) return <div className="p-4">Loading...</div>;

  // Show other errors (not auth related)
  if (error && !error.message.includes('Not authenticated with Xero')) {
    return <div className="p-4 text-red-600">Error: {error.message}</div>;
  }

  // Show main interface
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Category Mapping</h1>
      <div className="space-y-4">
        {xeroAccounts.map(account => (
          <CategoryMapper
            key={account.id}
            xeroAccount={account}
            actualCategories={actualCategories}
            onMappingChange={handleMappingChange}
          />
        ))}
      </div>
      {xeroAccounts.length > 0 && (
        <button
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Mappings
        </button>
      )}
    </div>
  );
}