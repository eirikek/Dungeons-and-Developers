import { test, expect } from '@playwright/test';

test.describe('Monster API End-to-End Test', () => {
  const GRAPHQL_URL = 'http://localhost:4000';

  test('Fetch monsters, filter by type, and fetch single monster details', async ({ request }) => {
    // 1. Hent liste med monstre
    let response = await request.post(GRAPHQL_URL, {
      data: {
        query: `
          query GetMonsters($offset: Int, $limit: Int) {
            monsters(offset: $offset, limit: $limit) {
              monsters {
                id
                name
                type
              }
              totalMonsters
            }
          }
        `,
        variables: {
          offset: 0,
          limit: 5,
        },
      },
    });
    expect(response.ok()).toBeTruthy();
    const listResponseData = await response.json();
    const monsters = listResponseData.data?.monsters?.monsters;
    expect(monsters).not.toBeNull();
    expect(monsters.length).toBeGreaterThan(0);

    // 2. Filtrer monsterlisten etter type
    const monsterType = monsters[0].type; // For testing purposes, bruker type fra første monster
    response = await request.post(GRAPHQL_URL, {
      data: {
        query: `
          query GetMonstersByType($type: String!) {
            monsters(types: [$type]) {
              monsters {
                id
                name
                type
              }
            }
          }
        `,
        variables: {
          type: monsterType,
        },
      },
    });
    const filterResponseData = await response.json();
    const filteredMonsters = filterResponseData.data?.monsters?.monsters;
    expect(filteredMonsters).not.toBeNull();
    expect(filteredMonsters.every((m: any) => m.type === monsterType)).toBe(true);

    // 3. Hent detaljer for et spesifikt monster
    const monsterId = monsters[0].id; // Bruker ID fra første monster i listen
    response = await request.post(GRAPHQL_URL, {
      data: {
        query: `
          query GetMonster($id: ID!) {
            monster(id: $id) {
              id
              name
              type
              alignment
              hit_points
              image
            }
          }
        `,
        variables: {
          id: monsterId,
        },
      },
    });
    const monsterDetailData = await response.json();
    const monster = monsterDetailData.data?.monster;
    expect(monster).not.toBeNull();
    expect(monster).toHaveProperty('id', monsterId);
    expect(monster).toHaveProperty('name');
    expect(monster).toHaveProperty('type');
    expect(monster).toHaveProperty('alignment');
    expect(monster).toHaveProperty('hit_points');
    expect(monster).toHaveProperty('image');
  });
});
