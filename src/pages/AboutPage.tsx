import React from 'react';
import { motion } from 'motion/react';
import { User, GraduationCap, Building2, Code, Heart, Sparkles } from 'lucide-react';

export function AboutPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto p-6 space-y-8"
    >
      <div className="text-center space-y-4 mb-12 mt-8">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-indigo-500/30 transform rotate-3"
        >
          <Code className="w-12 h-12 text-white" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
          About the App
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          TNBusTrack is a modern, intelligent bus tracking and booking platform designed to revolutionize public transportation.
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 text-indigo-50 opacity-50 pointer-events-none">
            <Sparkles className="w-64 h-64" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
            <Heart className="w-6 h-6 text-rose-500" />
            Created By
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 relative z-10">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-100 shadow-sm"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <User className="w-6 h-6" />
              </div>
              <div className="text-sm text-slate-500 font-medium mb-1">Developer</div>
              <div className="text-xl font-bold text-slate-800">MONISH E</div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-100 shadow-sm"
            >
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="text-sm text-slate-500 font-medium mb-1">Year</div>
              <div className="text-xl font-bold text-slate-800">FIRST YEAR</div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-100 shadow-sm md:col-span-2 lg:col-span-1"
            >
              <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="text-sm text-slate-500 font-medium mb-1">Institution</div>
              <div className="text-lg font-bold text-slate-800 leading-tight">BANNARI AMMAN INSTITUTE OF TECHNOLOGY</div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
