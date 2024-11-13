import { test, expect } from '@playwright/test';

test.describe('User End-to-End Test with Authentication', () => {
  const GRAPHQL_URL = 'http://127.0.0.1:4000';
  const testUserName = `testUserE2E_${Date.now()}`;

  let userId: string;
  let authToken: string;

  // Wait for 5 seconds to ensure the server is up
  test.beforeAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
  });

  test('Create a user', async ({ request }) => {
    const response = await request.post(GRAPHQL_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        query: `
          mutation CreateUser($userName: String!) {
            createUser(userName: $userName) {
              user {
                id
                userName
                class {
                  name
                }
                race {
                  name
                }
              }
              token
            }
          }
        `,
        variables: {
          userName: testUserName,
        },
      },
    });

    const responseStatus = response.status();
    const responseText = await response.text();
    console.log('Create User Response Status:', responseStatus);
    console.log('Create User Response Text:', responseText);

    expect(response.ok()).toBeTruthy();

    const responseData = await response.json();
    authToken = responseData.data?.createUser?.token;
    userId = responseData.data?.createUser?.user?.id;

    expect(userId).toBeDefined();
    expect(authToken).toBeDefined();
  });
});
