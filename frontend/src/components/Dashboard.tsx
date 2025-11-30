import React, { useState, type ReactNode } from 'react';
import { UserHeader, SubscriptionCard, Modal } from './index';
import { useUser } from '../hooks/useUser';
import { useSubjects } from '../hooks/useSubjects';

interface DashboardProps {
  children?: ReactNode;
}

export default function Dashboard({ children }: DashboardProps) {
  const { user, isLoading: isUserLoading, isSaving, error: userError, showPhoneModal, setShowPhoneModal, logout, updateProfile } = useUser();
  const { subjects, isLoading: isSubjectsLoading, error: subjectsError, toggleSubject } = useSubjects(user);

  const [showEditModal, setShowEditModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handleOpenEditModal = () => {
    if (user) {
      setNameInput(user.name);
      setPhoneInput(user.phone || '');
      setPhoneError('');
      setShowEditModal(true);
    }
  };

  const handleSaveProfile = async () => {
    const cleanPhone = phoneInput.replace(/\D/g, '');
    if (cleanPhone.length < 9) {
      setPhoneError('Por favor, introduce un número válido.');
      return;
    }
    if (!nameInput.trim()) {
      setPhoneError('El nombre no puede estar vacío.');
      return;
    }

    try {
      const subscribedSubjectCodes = subjects.filter(s => s.subscribed).map(s => s.id);
      await updateProfile(nameInput, cleanPhone, subscribedSubjectCodes);
      setShowEditModal(false);
      setPhoneError('');
    } catch (err: any) {
      setPhoneError(err.message || "Failed to save profile.");
    }
  };

  const handleSaveSubscriptions = async () => {
    if (!user) return;
    try {
      const subscribedSubjectCodes = subjects.filter(s => s.subscribed).map(s => s.id);
      await updateProfile(user.name, user.phone || '', subscribedSubjectCodes);
    } catch (err: any) {
      console.error("Error saving subscriptions:", err);
    }
  };

  if (!user || isUserLoading || isSubjectsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-100 border-t-indigo-600 animate-spin"></div>
      </div>
    );
  }

  if (userError || subjectsError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4 text-red-600 text-lg">
        {userError || subjectsError}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-12 relative">

      {/* Onboarding Modal */}
      <Modal
        isOpen={showPhoneModal}
        title="Vincula tu WhatsApp"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
          </svg>
        }
      >
        <div className="space-y-4">
          <p className="text-slate-500 text-center text-sm mb-4">Para enviarte las notificaciones, necesitamos tu número de teléfono activo en WhatsApp.</p>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Número de teléfono</label>
            <input
              type="tel"
              placeholder="+34 600 000 000"
              value={phoneInput}
              onChange={(e) => { setPhoneInput(e.target.value); setPhoneError(''); }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-900"
            />
            {phoneError && <p className="text-red-500 text-xs mt-2 font-medium">{phoneError}</p>}
          </div>
          <button onClick={handleSaveProfile} disabled={isSaving} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {isSaving ? 'Guardando...' : 'Continuar'}
          </button>

        </div>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal isOpen={showEditModal} title="Editar Perfil" onClose={() => setShowEditModal(false)}>
        <div className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-slate-700 mb-1">Nombre completo</label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-slate-900"
            />
          </div>
          <div>
            <label htmlFor="edit-phone" className="block text-sm font-medium text-slate-700 mb-1">Número de teléfono</label>
            <input
              type="tel"
              value={phoneInput}
              onChange={(e) => { setPhoneInput(e.target.value); setPhoneError(''); }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-slate-900"
            />
            {phoneError && <p className="text-red-500 text-xs mt-2 font-medium">{phoneError}</p>}
          </div>
          <div className="pt-2 flex gap-3">
            <button onClick={() => setShowEditModal(false)} className="flex-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold py-3 rounded-xl transition-all">Cancelar</button>
            <button onClick={handleSaveProfile} disabled={isSaving} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </Modal>

      <UserHeader user={user} onLogout={logout} onEditProfile={handleOpenEditModal} />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900">Mis Suscripciones</h3>
              <p className="text-sm text-slate-500 mt-1">Elige las asignaturas para recibir notificaciones WhatsApp.</p>
            </div>

            <div className="p-6 grid gap-4 sm:grid-cols-2">
              {subjects.map(subject => (
                <SubscriptionCard key={subject.id} subject={subject} onToggle={toggleSubject} />
              ))}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleSaveSubscriptions}
                disabled={isSaving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                {!isSaving && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}