import React from 'react';
import Select from 'react-select';
import {XeroAccount, ActualCategory} from '../types';
import {saveMappings} from "../services/api.ts";

interface Props {
    xeroAccount: XeroAccount;
    actualCategories: ActualCategory[];
    onMappingChange: (xeroAccountId: string, actualCategoryId: string) => void;
}


export function CategoryMapper({xeroAccount, actualCategories, onMappingChange}: Props) {
// In App.tsx, add this before returning CategoryMapper:
    console.log('CategoryMapper received xeroAccount:', xeroAccount);
    return (
        <div className="flex items-center gap-4">
            <div className="w-1/3">
                <p className="font-medium">{xeroAccount.name}</p>
                <p className="text-sm text-gray-500">{xeroAccount.type}</p>
            </div>
            <div className="w-2/3">
                <Select
                    options={actualCategories.map(cat => ({
                        value: cat.id,
                        label: cat.group ? `${cat.group} > ${cat.name}` : cat.name
                    }))}
                    onChange={option => {
                        if (option) {
                            console.log('Autosaving with:', xeroAccount.id, option.value);
                            onMappingChange(xeroAccount.id, option.value);
                            saveMappings([{xeroAccountId: xeroAccount.id, actualCategoryId: option.value}]);
                        }
                    }}
                    placeholder="Select Actual category..."
                    isClearable
                />
            </div>
        </div>
    );
}