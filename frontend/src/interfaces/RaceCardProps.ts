import RaceProps from './RaceProps.ts';

export default interface RaceCardProps extends RaceProps {
  selectedRaceId: string;
  onSelect: (id: string) => void;
}
