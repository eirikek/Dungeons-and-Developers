import { expect, test } from '@playwright/test';

test.describe('monster Queries test', () => {
  const GRAPHQL_URL = 'http://localhost:4000';

  test('Fetch monsters with pagination', async ({ request }) => {
    const response = await request.post(GRAPHQL_URL, {
      data: {
        query: `
          query GetMonsters($searchTerm: String, $offset: Int, $limit: Int, $types: [String!]) {
            monsters(searchTerm: $searchTerm, offset: $offset, limit: $limit, types: $types) {
              monsters {
                id
                name
                size
                type
                alignment
                hit_points
                image
              }
              totalMonsters
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
    const monsters = responseData.data?.monsters?.monsters;

    expect(monsters).not.toBeNull();
    expect(monsters.length).toBeGreaterThan(0);

    expect(monsters[0]).toHaveProperty('id');
    expect(monsters[0]).toHaveProperty('name');
    expect(monsters[0]).toHaveProperty('size');
    expect(monsters[0]).toHaveProperty('type');
    expect(monsters[0]).toHaveProperty('alignment');
    expect(monsters[0]).toHaveProperty('hit_points');
    expect(monsters[0]).toHaveProperty('image');
  });
});
