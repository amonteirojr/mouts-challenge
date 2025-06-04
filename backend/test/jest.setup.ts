import { config } from 'dotenv';

// Load environment variables from .env.test file
config({ path: '.env.test' });

// Increase timeout for e2e tests
jest.setTimeout(30000); 