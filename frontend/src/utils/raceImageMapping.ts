import dragonborn from '../assets/images/race/dragonborn.webp';
import dwarf from '../assets/images/race/dwarf.webp';
import elf from '../assets/images/race/elf.webp';
import gnome from '../assets/images/race/gnome.webp';
import half_elf from '../assets/images/race/half-elf.webp';
import half_orc from '../assets/images/race/half-orc.webp';
import halfling from '../assets/images/race/halfling.webp';
import human from '../assets/images/race/human.webp';
import tiefling from '../assets/images/race/tiefling.webp';

/**
 * A mapping of race names to their corresponding image file paths.
 *
 * The keys are the names of the races, and the values are the paths to the images
 * representing those races.
 *
 *
 * @type {Object.<string, string>}
 */
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
