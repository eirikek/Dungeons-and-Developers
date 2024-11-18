export default interface MonsterGraphQL {
  __typename?: string;
  id: string;
  name: string;
  size: string;
  type: string;
  alignment: string;
  hit_points: number;
  image?: string;
}
