import React from 'react';

interface User {
    name: string;
    email: string;
    picture: string;
    phone?: string;
}

interface UserHeaderProps {
    user: User;
    onLogout: () => void;
    onEditProfile: () => void;
}

export default function UserHeader({ user, onLogout, onEditProfile }: UserHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-5">
                <div className="relative">
                    {user.picture ? (
                        <img src={user.picture} alt={user.name} className="w-16 h-16 rounded-2xl shadow-md object-cover ring-4 ring-white" />
                    ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md ring-4 ring-white flex items-center justify-center text-white text-2xl font-bold uppercase">
                            {user.name ? user.name.charAt(0) : user.email.charAt(0)}
                        </div>
                    )}
                    {/* Status indicator only, no edit button */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{user.name}</h2>
                        <button onClick={onEditProfile} className="text-slate-300 hover:text-indigo-600 transition-colors" title="Editar nombre">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-slate-500 font-medium text-sm mt-1">
                        <span>{user.email}</span>
                        {user.phone && (
                            <>
                                <span className="hidden sm:inline w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-green-500">
                                        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                                        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                                    </svg>
                                    {user.phone}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <button 
                onClick={onLogout}
                className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 bg-white hover:bg-red-50 px-5 py-2.5 rounded-xl border border-slate-200 hover:border-red-200 transition-all shadow-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Cerrar Sesión
            </button>
        </div>
    );
}