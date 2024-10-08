import dragonborn from '../assets/images/dragonborn.png';
import dwarf from '../assets/images/dwarf.png';
import elf from '../assets/images/elf.png';
import gnome from '../assets/images/gnome.png';
import half_elf from '../assets/images/half-elf.png';
import half_orc from '../assets/images/half-orc.png';
import halfling from '../assets/images/halfling.png';
import human from '../assets/images/human.png';
import tiefling from '../assets/images/tiefling.png';

// Mapping the race names to their respective images
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