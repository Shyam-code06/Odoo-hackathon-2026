import { motion } from 'framer-motion';

// Premium Bezier easing curve (cubic-bezier(0.16, 1, 0.3, 1)) matching premium SaaS tools
const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: [0.7, 0, 0.84, 0],
    },
  },
};

/**
 * Reusable wrapper component for animated route page transitions
 */
export function PageWrapper({ children, className = '' }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`flex flex-col flex-1 w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default PageWrapper;
