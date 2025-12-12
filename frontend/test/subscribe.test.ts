import { describe, it, expect, vi } from 'vitest';
import { POST } from '../src/pages/api/subscribe/index'; // Endpoint to create
import { POST as createSubject } from '../src/pages/api/subjects/index'; // Helper to seed subjects

describe('POST /api/subscribe', () => {
    // Helper to seed a subject
    const seedSubject = async (code: string, name: string) => {
        const req = new Request('http://localhost:4321/api/subjects', {
            method: 'POST',
            body: JSON.stringify({ code, name })
        });
        const ctx = { request: req, params: {}, redirect: vi.fn() } as any;
        await createSubject(ctx);
    };

    it('creates user and subscribes to valid subjects', async () => {
        const subjectCode = 'SUB-TEST-1';
        await seedSubject(subjectCode, 'Subject for Subscribe Test');

        const userData = {
            email: 'subscriber@test.com',
            name: 'New Subscriber',
            phone: '123456789',
            subjects: [subjectCode]
        };

        const req = new Request('http://localhost:4321/api/subscribe', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        const ctx = { request: req, params: {}, redirect: vi.fn() } as any;

        const response = await POST(ctx);
        expect(response.status).toBe(200);

        const body = await response.json();
        expect(body.email).toBe(userData.email);
        // Expect subjects to be returned in user object usually, or just user.
        // Backend schemas.User has subjects: List[Subject]
        expect(body.subjects).toHaveLength(1);
        expect(body.subjects[0].code).toBe(subjectCode);
    });

    it('fails if subject does not exist', async () => {
         const userData = {
            email: 'fail@test.com',
            name: 'Fail User',
            phone: '000',
            subjects: ['NON-EXISTENT-CODE']
        };
        const req = new Request('http://localhost:4321/api/subscribe', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        const ctx = { request: req, params: {}, redirect: vi.fn() } as any;

        const response = await POST(ctx);
        expect(response.status).toBe(400);
    });
});
