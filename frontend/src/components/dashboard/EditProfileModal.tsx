import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, phone: string) => void;
    initialName: string;
    initialPhone: string;
}

export default function EditProfileModal({ isOpen, onClose, onSave, initialName, initialPhone }: EditProfileModalProps) {
    const [name, setName] = useState(initialName);
    const [phone, setPhone] = useState(initialPhone);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName(initialName);
            // Strip 34 prefix if present for display
            let phoneToDisplay = initialPhone;
            if (phoneToDisplay.startsWith('34')) {
                phoneToDisplay = phoneToDisplay.substring(2);
            }
            setPhone(phoneToDisplay);
            setError('');
        }
    }, [isOpen, initialName, initialPhone]);

    const handleSave = () => {
        if (phone.includes('+')) {
            setError('No escribas el prefijo (+34), solo tu número.');
            return;
        }

        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length < 9) {
            setError('Por favor, introduce un número válido.');
            return;
        }
        if (!name.trim()) {
            setError('El nombre no puede estar vacío.');
            return;
        }
        // Prepend 34
        onSave(name, `34${cleanPhone}`);
    };

    return (
        <Modal isOpen={isOpen} title="Editar Perfil" onClose={onClose}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="edit-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre completo</label>
                    <input
                        type="text"
                        id="edit-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                    />
                </div>
                <div>
                    <label htmlFor="edit-phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Número de teléfono</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">+34</span>
                        </div>
                        <input
                            type="tel"
                            id="edit-phone"
                            value={phone}
                            onChange={(e) => { setPhone(e.target.value); setError(''); }}
                            className="w-full pl-14 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
                </div>
                <div className="pt-2 flex gap-3">
                    <button onClick={onClose} className="flex-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold py-3 rounded-xl transition-all">Cancelar</button>
                    <button onClick={handleSave} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all">Guardar</button>
                </div>
            </div>
        </Modal>
    );
}
