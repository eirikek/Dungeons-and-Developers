import dragonborn from '../race/dragonborn.png';
import dwarf from '../race/dwarf.png';
import elf from '../race/elf.png';
import gnome from '..race/gnome.png';
import half_elf from '../race/half-elf.png';
import half_orc from '../race/half-orc.png';
import halfling from '/race/halfling.png';
import human from '../race/human.png';
import tiefling from '../race/tiefling.png';

const imageMapping: { [key: string]: string } = {
  dragonborn,
  dwarf,
  elf,
  gnome,
  'half-elf': half_elf,
  'half-orc': half_orc,
  halfling,
  human,
  tiefling,
};

export default imageMapping;