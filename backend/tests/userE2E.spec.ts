import { test, expect } from '@playwright/test';

test.describe('Registration and login', () => {
  const GRAPHQL_URL = 'http://localhost:4000';

  test('Register a new user', async ({ request }) => {
    let response = await request.post(GRAPHQL_URL, {
      data: {
        mutation: ` 
        
        `,
      },
    });
  });
});
