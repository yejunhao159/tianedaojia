import type { Variants, Transition } from "framer-motion";

export const spring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 25,
};

export const smooth: Transition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1],
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...smooth, delay: i * 0.06 },
  }),
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { ...smooth, delay: i * 0.06 },
  }),
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { ...smooth, delay: i * 0.06 },
  }),
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { ...smooth, delay: i * 0.06 },
  }),
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export const scaleOnTap = {
  whileTap: { scale: 0.97 },
  transition: spring,
};

export const hoverLift = {
  whileHover: { y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" },
  transition: spring,
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { ...smooth, duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};
