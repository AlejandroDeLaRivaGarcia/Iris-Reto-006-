import dotenv from 'dotenv';
import path from 'path';
import { vi } from 'vitest';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const dbUrl = process.env.DATABASE_URL?.replace('@db:5432', '@localhost:10004');

if (dbUrl) {
    process.env.DATABASE_URL = dbUrl;
}

console.log('Setup: DATABASE_URL mocked to', dbUrl);

// Define import.meta.env
vi.stubGlobal('import', {
    meta: {
        env: {
            DATABASE_URL: dbUrl,
            SSR: true
        }
    }
});

