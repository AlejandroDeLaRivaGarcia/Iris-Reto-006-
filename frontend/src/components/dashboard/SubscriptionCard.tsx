import React from 'react';

interface Subject {
    id: string;
    name: string;
    subscribed: boolean;
}

interface SubscriptionCardProps {
    subject: Subject;
    onToggle: (id: string) => void;
}

export default function SubscriptionCard({ subject, onToggle }: SubscriptionCardProps) {
    return (
        <label 
            className={`
                relative flex items-start p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 group
                ${subject.subscribed 
                    ? 'border-indigo-600 bg-indigo-50/30 shadow-indigo-100 shadow-inner' 
                    : 'border-slate-100 hover:border-indigo-200 hover:shadow-md bg-white'
                }
            `}
        >
            <input 
                type="checkbox" 
                checked={subject.subscribed}
                onChange={() => onToggle(subject.id)}
                className="sr-only"
            />
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <span className={`font-semibold transition-colors ${subject.subscribed ? 'text-indigo-700' : 'text-slate-700 group-hover:text-slate-900'}`}>
                        {subject.name}
                    </span>
                    {subject.subscribed && (
                        <div className="text-indigo-600 bg-indigo-100 p-1 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                </div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Código: {subject.id}</span>
            </div>
        </label>
    );
}