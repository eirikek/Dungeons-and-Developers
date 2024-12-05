import barbarian from '../assets/images/class/barbarian.webp';
import bard from '../assets/images/class/bard.webp';
import cleric from '../assets/images/class/cleric.webp';
import druid from '../assets/images/class/druid.webp';
import fighter from '../assets/images/class/fighter.webp';
import monk from '../assets/images/class/monk.webp';
import paladin from '../assets/images/class/paladin.webp';
import ranger from '../assets/images/class/ranger.webp';
import rogue from '../assets/images/class/rogue.webp';
import sorcerer from '../assets/images/class/sorcerer.webp';
import warlock from '../assets/images/class/warlock.webp';
import wizard from '../assets/images/class/wizard.webp';

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
