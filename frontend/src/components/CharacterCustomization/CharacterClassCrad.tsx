import React from 'react';
import { motion } from 'framer-motion';
import barbarian from '../../assets/c3barbarianintro.png'
import cleric from '../../assets/c3clericintro.png'
import druid from '../../assets/c3druidintro.png'
import fighter from '../../assets/c3fighterintro.png'
import monk from '../../assets/c3monkintro.png'
import paladin from '../../assets/c3paladinintro.png'
import ranger from '../../assets/c3rangerintro.png'
import rogue from '../../assets/c3rogueintro.png'
import sorcerer from '../../assets/c3sorcererintro.png'
import warlock from '../../assets/c3warlockintro.png'
import wizard from '../../assets/c3wizardintro.png'
import bard from '../../assets/c3bardintro.png'

const classImages: { [key: string]: string } = {
  barbarian,
  cleric,
  druid,
  fighter,
  monk,
  paladin,
  ranger,
  rogue,
  sorcerer,
  warlock,
  wizard,
  bard
};

interface CharacterClassCardProps {
  index: string;
  name: string;
  hit_die: number;
}
const CharacterClassCard: React.FC<CharacterClassCardProps> = ({ name,hit_die, index }) => {
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

        <img src={classImage} alt="{index}" className="max-w-60 max-h-80 border-none shadow-none" />
        <h2 className="text-3xl">{name}</h2>
        <p className="text-sm">This is your Hit-die, this is how many sides your die should
          have: {hit_die} </p>
        <input type="checkbox" id="indexCheckbox" name="index" />
    </motion.section>
  );
}
export default CharacterClassCard;