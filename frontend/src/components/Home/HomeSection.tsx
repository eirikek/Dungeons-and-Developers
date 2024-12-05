import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import SectionProps from '../../interfaces/SectionProps.ts';

/**
 * Renders a home section. Home section has different values and changes based on:
 *
 * @param {string} title - The section title.
 * @param {string} text - The text content of the section.
 * @param {string} image - The image URL.
 * @param {boolean} reversed - Boolean value to reverse the section.
 * @param {React.Ref} ref - Reference passed to the element.
 *
 */
const HomeSection = forwardRef<HTMLDivElement, SectionProps>(
  ({ title, text, image, reversed = false }: SectionProps, ref) => {
    // Animation variants for text and header coming from the bottom
    const textVariants = {
      hidden: { opacity: 0, y: 100 },
      visible: { opacity: 1, y: 0 },
    };

    // Animation variants for the image coming from the left or right
    const imageVariants = {
      hidden: { opacity: 0, x: reversed ? -150 : 150 },
      visible: { opacity: 1, x: 0 },
    };

    return (
      <section ref={ref} className="flex flex-col 3xl:w-3/4 w-5/6">
        <div
          className={`flex gap-10 ${reversed ? '2xl:flex-row-reverse flex-col' : '2xl:flex-row flex-col'} laptop:flex-col items-center`}
        >
          {/* Text and Header Fade-in Animation */}
          <motion.div
            className="w-full 2xl:w-3/5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            variants={textVariants}
          >
            <h2 className="header font-bold mb-4">{title}</h2>
            <div className="text leading-10">{text}</div>
          </motion.div>

          {/* Image Slide-in Animation */}
          <motion.div
            className="w-2/5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            variants={imageVariants}
          >
            <img src={image} alt={title} className="shadow-none w-auto hidden 2xl:block" />
          </motion.div>
        </div>
      </section>
    );
  }
);

export default HomeSection;
