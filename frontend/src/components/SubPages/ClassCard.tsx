import { motion } from 'framer-motion';
import classImages from '../../utils/classImageMapping.ts';
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox.tsx';

import ClassProps from '../../interfaces/ClassProps.ts';

interface ClassCardProps extends ClassProps {
  selectedClassId: string;
  onSelect: (id: string) => void;
}

const ClassCard = ({ id, name, hit_die, index, skills = [], selectedClassId, onSelect }: ClassCardProps) => {
  const classImage = classImages[index];

  const handleSelectClass = () => {
    if (selectedClassId !== id) {
      onSelect(id);
    }
  };

  return (
    <motion.article
      className="flex flex-col xl:flex-row xl:h-60 w-full justify-between items-center p-8 xl:p-12 rounded-lg bg-black bg-opacity-90 gap-10 card"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'circInOut' }}
      variants={{
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0 },
      }}
      role="article"
      aria-labelledby={`${id}-name`}
      aria-describedby={`${id}-details`}
    >
      <div className="flex flex-col xl:flex-row gap-5 justify-center items-center">
        <figure className="max-w-44">
          <img src={classImage} alt={`${name} class illustration`} className="shadow-none" />
          <figcaption className="sr-only">{name}</figcaption>
        </figure>
        <div role="group">
          <h2 id={`${id}-name`} className="sub-header bold">
            {name}
          </h2>
          <p id={`${id}-details`} className="text">
            <span className="bold">HP:</span> {hit_die}
          </p>
          <p className="text">
            <span className="bold">Skills:</span> {skills.join(', ')}
          </p>
        </div>
      </div>
      <div className="w-1/5 flex items-center justify-center xl:justify-end">
        <CustomCheckbox scale={2} checked={selectedClassId === id} onChange={handleSelectClass} disableUncheck={true} />
      </div>
    </motion.article>
  );
};

export default ClassCard;
