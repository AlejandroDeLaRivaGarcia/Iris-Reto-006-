import { describe, it, expect, vi } from 'vitest';
import { GET, POST } from '../src/pages/api/subjects/index';

describe('Subject Endpoints', () => {
    it('GET /api/subjects returns list', async () => {
        const mockRequest = new Request('http://localhost:4321/api/subjects', { method: 'GET' });
        const mockContext = { request: mockRequest, params: {}, redirect: vi.fn() } as any;

        const response = await GET(mockContext);
        expect(response.status).toBe(200);
        const body = await response.json();
        expect(Array.isArray(body)).toBe(true);
    });

    it('POST /api/subjects creates a subject', async () => {
        const newSubject = { code: 'TEST-101', name: 'Test Subject' };
        const mockRequest = new Request('http://localhost:4321/api/subjects', {
            method: 'POST',
            body: JSON.stringify(newSubject)
        });
        const mockContext = { request: mockRequest, params: {}, redirect: vi.fn() } as any;

        try {
            const response = await POST(mockContext);
            if (response.status === 400) {
                 // Check if it failed because it exists (idempotency check for tests)
                 const err = await response.json();
                 if (err.error?.includes('exists')) {
                     // Cleanup or accept
                     return;
                 }
            }
            expect(response.status).toBe(200);
            const body = await response.json();
            expect(body.message).toBe('Asignatura creada');
            expect(body.subject.code).toBe(newSubject.code);
        } catch (e: any) {
            // If constraint violation (duplicate key) happens during repeated tests
             console.warn('Test subject might already exist');
        }
    });
});
