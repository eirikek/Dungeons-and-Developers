import type { MonsterCardProps } from './MonsterCardProps.ts';

export default interface MonsterGridProps {
  monsters?: MonsterCardProps[];
  isDungeonPage?: boolean;
}
