import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { BackendSubject, FrontendSubject, User } from '../types';

export const useSubjects = (user: User | null) => {
        const [allSubjects, setAllSubjects] = useState<BackendSubject[]>([]);
        const [subjects, setSubjects] = useState<FrontendSubject[]>([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
                const fetchSubjects = async () => {
                        try {
                                setIsLoading(true);
                                const fetchedSubjects = await api.getSubjects();
                                setAllSubjects(fetchedSubjects);
                                setError(null);
                        } catch (err) {
                                console.error("Error fetching subjects:", err);
                                setError("Failed to load subjects. Please try again.");
                        } finally {
                                setIsLoading(false);
                        }
                };
                fetchSubjects();
        }, []);

        useEffect(() => {
                if (allSubjects.length > 0) {
                        const userSubscribedCodes = new Set(user?.subjects?.map(s => s.code) || []);
                        const combinedSubjects: FrontendSubject[] = allSubjects.map(backendSub => ({
                                id: backendSub.code,
                                name: backendSub.name,
                                subscribed: userSubscribedCodes.has(backendSub.code),
                        }));
                        setSubjects(combinedSubjects);
                }
        }, [user, allSubjects]);

        const toggleSubject = (id: string) => {
                setSubjects(prevSubjects =>
                        prevSubjects.map(s =>
                                s.id === id ? { ...s, subscribed: !s.subscribed } : s
                        )
                );
        };

        return {
                subjects,
                isLoading,
                error,
                toggleSubject,
        };
};
