"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeInUp, hoverLift } from "@/lib/motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  hover?: boolean;
  index?: number;
}

export function GlassCard({ children, className, hover = false, index = 0, ...props }: GlassCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      custom={index}
      {...(hover ? hoverLift : {})}
      className={cn("glass-card rounded-2xl p-5", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
