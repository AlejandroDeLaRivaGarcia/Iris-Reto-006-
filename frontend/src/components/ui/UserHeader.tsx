import React from 'react';
import type { User } from '../../types';

interface UserHeaderProps {
        user: User | null;
        onLogout: () => void;
        onEditProfile: () => void;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ user, onLogout, onEditProfile }) => {
        if (!user) return null;

        return (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

                        <div className="flex items-center gap-5 z-10 w-full sm:w-auto">
                                <div className="relative group">
                                        <img
                                                src={user.picture}
                                                alt={user.name}
                                                className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/10"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                        <h2 className="text-2xl font-bold text-slate-900 truncate tracking-tight">{user.name}</h2>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm mt-0.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 opacity-70">
                                                        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                                                        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                                                </svg>
                                                <span className="truncate">{user.email}</span>
                                        </div>
                                </div>
                        </div>

                        <div className="flex items-center gap-3 z-10 w-full sm:w-auto">
                                <button
                                        onClick={onEditProfile}
                                        className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow active:scale-95"
                                >
                                        Editar Perfil
                                </button>
                                <button
                                        onClick={onLogout}
                                        className="flex-1 sm:flex-none px-4 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-semibold hover:bg-red-100 hover:border-red-200 transition-all shadow-sm hover:shadow active:scale-95"
                                >
                                        Cerrar Sesión
                                </button>
                        </div>
                </div>
        );
};
