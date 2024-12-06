import ClassProps from './ClassProps.ts';

export default interface ClassCardProps extends ClassProps {
  selectedClassId: string;
  onSelect: (id: string) => void;
}
