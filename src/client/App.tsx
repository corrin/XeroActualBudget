import React, { useState } from 'react';
import { CategoryMapper } from './components/CategoryMapper';
import { useCategories } from './hooks/useCategories';
import { saveMappings, connectToXero } from './services/api';
import { CategoryMapping } from './types';

export default function App() {
  const { xeroAccounts, actualCategories, isLoading, error } = useCategories();
  const [mappings, setMappings] = useState<CategoryMapping[]>([]);

  const handleConnect = () => {
    window.location.href = '/api/xero/connect';
  };

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

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Category Mapping</h1>
      {xeroAccounts.length === 0 && (
        <div className="mb-4">
          <button
            onClick={handleConnect}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Connect to Xero
          </button>
        </div>
      )}
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
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save Mappings
      </button>
    </div>
  );
}