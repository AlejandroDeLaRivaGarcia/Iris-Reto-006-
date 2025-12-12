import { db } from '../db';
import { users, subjects, userSubjects } from '../db/schema';
import { eq, inArray } from 'drizzle-orm';
import { getSubjectsByCodes } from './subjects';

export interface SubscriptionData {
    email: string;
    name?: string;
    phone?: string;
    subjectCodes: string[];
}

export const subscribeUser = async (data: SubscriptionData) => {
    const { email, name, phone, subjectCodes } = data;

    const existingSubjects = await getSubjectsByCodes(subjectCodes);
    
    if (existingSubjects.length !== subjectCodes.length) {
        throw new Error("One or more subjects not found");
    }

    const resultUser = await db.transaction(async (tx) => {
        const [upsertedUser] = await tx.insert(users)
            .values({ email, name, phone })
            .onConflictDoUpdate({
                target: users.email,
                set: { name, phone } 
            })
            .returning();

        await tx.delete(userSubjects).where(eq(userSubjects.userId, upsertedUser.id));

        if (subjectCodes.length > 0) {
            await tx.insert(userSubjects).values(
                subjectCodes.map((code: string) => ({
                    userId: upsertedUser.id,
                    subjectCode: code
                }))
            );
        }

        return upsertedUser;
    });

    return {
        ...resultUser,
        subjects: existingSubjects
    };
};
