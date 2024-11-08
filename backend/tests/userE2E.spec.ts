import { test, expect } from '@playwright/test';

test.describe('User End-to-End Test', () => {
  const GRAPHQL_URL = 'http://localhost:4000';
  const testUserName = `testUserE2E_${Date.now()}`; // Unique username using timestamp

  let userId: string;

  // 1. Create a new user
  test('Create a user', async ({ request }) => {
    const response = await request.post(GRAPHQL_URL, {
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

    expect(response.ok()).toBeTruthy();
    const responseData = await response.json();
    console.log('Create User Response:', responseData);

    const user = responseData.data?.createUser?.user;

    // Check if the user was created successfully
    expect(user).not.toBeNull();
    expect(user).toHaveProperty('userName', testUserName);

    // Save the user ID for the next test
    userId = user.id;
    console.log('Created User ID:', userId);
  });

  // 2. Fetch the created user
  test('Fetch the created user', async ({ request }) => {
    console.log('Fetching User with ID:', userId);

    const response = await request.post(GRAPHQL_URL, {
      data: {
        query: `
        query GetUser($id: ID!) {
          user(id: $id) {
            id
            userName
            class {
              name
            }
            race {
              name
            }
          }
        }
      `,
        variables: {
          id: userId,
        },
      },
    });

    console.log('Response Status:', response.status());
    const responseText = await response.text();
    console.log('Response Text:', responseText);

    expect(response.ok()).toBeTruthy();
  });
});
