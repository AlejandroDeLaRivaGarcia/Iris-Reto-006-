import { db } from '../db';
import { subjects } from '../db/schema';
import { inArray } from 'drizzle-orm';

export const getAllSubjects = async () => {
    return await db.select().from(subjects);
};

export const createSubject = async (code: string, name: string) => {
    return await db.insert(subjects).values({ code, name }).returning();
};

export const getSubjectsByCodes = async (codes: string[]) => {
    return await db.select().from(subjects).where(inArray(subjects.code, codes));
};
