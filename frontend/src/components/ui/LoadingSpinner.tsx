import React from 'react';

export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                </div>
            </div>
        </div>
    );
}
