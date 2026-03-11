import React from 'react';
import { motion } from 'motion/react';

interface DashboardWidgetProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function DashboardWidget({ title, children, className = '' }: DashboardWidgetProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white/20 ${className}`}
    >
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </motion.div>
  );
}
