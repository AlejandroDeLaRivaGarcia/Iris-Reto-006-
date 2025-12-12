import { describe, it, expect, vi } from 'vitest';
import { GET, DELETE } from '../src/pages/api/users/[email]';
import { POST as subscribeUser } from '../src/pages/api/subscribe/index'; // Helper to create user
import { POST as createSubject } from '../src/pages/api/subjects/index'; // Helper to seed subject

describe('User Endpoints', () => {
    const seedUser = async (email: string) => {
         // Create subject first
         const subReq = new Request('http://localhost:4321/api/subjects', {
            method: 'POST', body: JSON.stringify({ code: 'U-TEST-1', name: 'User Test Sub' })
         });
         await createSubject({ request: subReq } as any);

         // Subscribe/Create User
         const userReq = new Request('http://localhost:4321/api/subscribe', {
            method: 'POST',
            body: JSON.stringify({ email, name: 'Test User', phone: '999', subjects: ['U-TEST-1'] })
         });
         await subscribeUser({ request: userReq } as any);
    };

    it('GET /api/users/[email] returns user', async () => {
        const email = 'getuser@test.com';
        await seedUser(email);

        const context = {
            params: { email },
            request: new Request(`http://localhost:4321/api/users/${email}`)
        } as any;

        const response = await GET(context);
        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.email).toBe(email);
    });

    it('GET /api/users/[email] returns 404 if not found', async () => {
         const context = {
            params: { email: 'notfound@test.com' },
            request: new Request('http://localhost:4321')
        } as any;
        const response = await GET(context);
        expect(response.status).toBe(404);
    });

    it('DELETE /api/users/[email] removes user', async () => {
        const email = 'deleteuser@test.com';
        await seedUser(email);

        const context = {
            params: { email },
            request: new Request(`http://localhost:4321/api/users/${email}`, { method: 'DELETE' })
        } as any;

        const response = await DELETE(context);
        expect(response.status).toBe(204);

        // Verify it's gone
        const getRes = await GET(context);
        expect(getRes.status).toBe(404);
    });
});
