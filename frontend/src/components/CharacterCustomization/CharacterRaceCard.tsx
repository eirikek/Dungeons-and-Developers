import React from 'react';
import { motion } from 'framer-motion';
import dragonborn from '../../assets/dragonborn.png'
import dwarf from '../../assets/dwarf.png'
import elf from '../../assets/elf.png'
import gnome from '../../assets/gnome.png'
import half_elf from '../../assets/half-elf.png'
import half_orc from '../../assets/half-orc.png'
import halfling from '../../assets/halfling.png'
import human from '../../assets/human.png'
import tiefling from '../../assets/tiefling.png'



const classImages: { [key: string]: string } = {
  dragonborn,
  dwarf,
  elf,
  gnome,
  'half-elf': half_elf, // Correctly map 'half-elf' to its variable
  'half-orc': half_orc,
  halfling,
  human,
  tiefling,


};

interface CharacterAbilityCardProps {
  index: string;
  alignment: string;
  name:string;

}
const CharacterRaceCard: React.FC<CharacterAbilityCardProps> = ({ name, alignment, index }) => {
  const classImage = classImages[index];
  return (
    <motion.section
      className="flex flex-row gap-5 items-center p-8 rounded-lg shadow-lg  bg-opacity-60 mt-5"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: 'circInOut' }}
      variants={{
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0 },
      }}
    >

        <img src={classImage} alt="{index}" className="max-w-60 max-h-80 shadow-none" />
        <h2 className="text-3xl">{name}</h2>
        <p className="text-sm">" {alignment} "</p>
        <input type="checkbox" id="indexCheckbox" name="index" />
    </motion.section>
);
}
export default CharacterRaceCard;