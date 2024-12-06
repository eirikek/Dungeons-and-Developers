export type MonsterDetailsModalProps = {
  id: string;
  name: string;
  hit_points: number;
  type: string;
  image: string;
  onClose: () => void;
};
