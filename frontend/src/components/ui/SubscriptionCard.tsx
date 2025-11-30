import React from 'react';
import type { FrontendSubject } from '../../types';

interface SubscriptionCardProps {
        subject: FrontendSubject;
        onToggle: (id: string) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subject, onToggle }) => {
        return (
                <div
                        onClick={() => onToggle(subject.id)}
                        className={`
                group relative flex items-center p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden
                ${subject.subscribed
                                        ? 'border-indigo-600 bg-indigo-50/50 shadow-md shadow-indigo-100'
                                        : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm'
                                }
            `}
                >
                        <div className="flex-1 min-w-0 z-10">
                                <div className="flex items-center gap-3 mb-1">
                                        <span className={`
                        text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider transition-colors
                        ${subject.subscribed ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}
                    `}>
                                                {subject.id}
                                        </span>
                                </div>
                                <h4 className={`
                    font-semibold text-base truncate transition-colors
                    ${subject.subscribed ? 'text-indigo-900' : 'text-slate-700 group-hover:text-slate-900'}
                `}>
                                        {subject.name}
                                </h4>
                        </div>

                        <div className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ml-4
                ${subject.subscribed
                                        ? 'bg-indigo-600 border-indigo-600 scale-110'
                                        : 'border-slate-300 bg-white group-hover:border-indigo-400'
                                }
            `}>
                                <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${subject.subscribed ? 'scale-100' : 'scale-0'}`}
                                >
                                        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                                </svg>
                        </div>

                        {/* Subtle background decoration */}
                        {subject.subscribed && (
                                <div className="absolute right-0 top-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-100/50 rounded-full blur-2xl pointer-events-none"></div>
                        )}
                </div>
        );
};
