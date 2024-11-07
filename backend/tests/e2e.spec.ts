import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:4000/');

  await expect(page).toHaveTitle('Apollo Server');
});

test('get started link', async ({ page }) => {
  await page.goto('http://localhost:4000/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Query your server' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Documentation' })).toBeVisible();
});

test.describe('Class Queries', () => {
  const GRAPHQL_URL = 'http://localhost:4000';

  test('Fetch classes with pagination', async ({ request }) => {
    const response = await request.post(GRAPHQL_URL, {
      data: {
        query: `
          query FetchClasses($offset: Int, $limit: Int) {
            classes(offset: $offset, limit: $limit) {
              classes {
                id
                name
                hit_die
                skills
              }
              totalClasses
            }
          }
        `,
        variables: {
          offset: 0,
          limit: 2,
        },
      },
    });
    expect(response.ok()).toBeTruthy();
    const responseData = await response.json();
    const classes = responseData.data.classes.classes;

    expect(classes.length).toBeGreaterThan(0);
    expect(classes[0]).toHaveProperty('id');
    expect(classes[0]).toHaveProperty('name');
    expect(classes[0]).toHaveProperty('hit_die');
    expect(Array.isArray(classes[0].skills)).toBe(true);
  });

  test('Fetch a single class by ID', async ({ request }) => {
    const response = await request.post(GRAPHQL_URL, {
      data: {
        query: `
          query FetchClass($id: ID!) {
            class(id: $id) {
              id
              name
              hit_die
              skills
            }
          }
        `,
        variables: {
          id: 'barbarian', // barbarian class ID
        },
      },
    });
    expect(response.ok()).toBeTruthy();
    const responseData = await response.json();

    const singleClass = responseData.data?.class;

    // Check for null response
    expect(singleClass).not.toBeNull();
    expect(singleClass).toHaveProperty('id', '672638aec87901f23954e2a2');
    expect(singleClass).toHaveProperty('name');
    expect(singleClass).toHaveProperty('hit_die');
    expect(Array.isArray(singleClass.skills)).toBe(true);
  });
});
