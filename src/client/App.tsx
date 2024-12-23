import React, {useState, useEffect} from 'react';
import {CategoryMapper} from './components/CategoryMapper';
import {useCategories} from './hooks/useCategories';
import {CategoryMapping} from './types';

export default function App() {
    const {xeroAccounts, actualCategories, isLoading, error} = useCategories();
    console.log('App received xeroAccounts:', xeroAccounts && xeroAccounts[0]);
    const [mappings, setMappings] = useState<CategoryMapping[]>([]);

    // Load existing mappings
    useEffect(() => {
        async function loadMappings() {
            try {
                console.log('Fetching mappings...');
                const response = await fetch('/api/mappings');
                if (!response.ok) {
                    throw new Error('Failed to load existing mappings');
                }
                const existingMappings = await response.json();
                console.log('Fetched mappings:', existingMappings);
                setMappings(existingMappings.map(m => ({
                    xeroAccountId: m.xero_account_id,
                    actualCategoryId: m.actual_category_id
                })));
                console.log('Set mappings state triggered.');
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
        console.log(`Mapped Xero Account ${xeroAccountId} to Actual Category ${actualCategoryId}`);
        setMappings(prev => {
            const existing = prev.findIndex(m => m.xeroAccountId === xeroAccountId);
            if (existing >= 0) {
                return [
                    ...prev.slice(0, existing),
                    {xeroAccountId, actualCategoryId},
                    ...prev.slice(existing + 1)
                ];
            }
            return [...prev, {xeroAccountId, actualCategoryId}];
        });
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
                {xeroAccounts.map((account) => {
                    const mapping = mappings.find((m) => m.xeroAccountId === account.accountID);

                    return (
                        <CategoryMapper
                            key={account.accountID}
                            xeroAccount={account}
                            actualCategories={actualCategories}
                            onMappingChange={handleMappingChange}
                            selectedCategoryId={mapping?.actualCategoryId || null} // Pass the selected category
                        />
                    );
                })}
            </div>
        </div>
    );
}