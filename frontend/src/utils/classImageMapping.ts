import barbarian from '../assets/images/class/barbarian.png';
import bard from '../assets/images/class/bard.png';
import cleric from '../assets/images/class/cleric.png';
import druid from '../assets/images/class/druid.png';
import fighter from '../assets/images/class/fighter.png';
import monk from '../assets/images/class/monk.png';
import paladin from '../assets/images/class/paladin.png';
import ranger from '../assets/images/class/ranger.png';
import rogue from '../assets/images/class/rogue.png';
import sorcerer from '../assets/images/class/sorcerer.png';
import warlock from '../assets/images/class/warlock.png';
import wizard from '../assets/images/class/wizard.png';

/**
 * A mapping of character class names to their corresponding image file paths.
 * Each key in the object represents a character class, and the value is the
 * file path to the image associated with that class.
 *
 * @type {Object.<string, string>}
 */
const classImageMapping: { [key: string]: string } = {
  barbarian,
  bard,
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
};

export default classImageMapping;
