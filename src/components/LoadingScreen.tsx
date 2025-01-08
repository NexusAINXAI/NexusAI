import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  progress: number;
  isComplete: boolean;
}

export function LoadingScreen({ progress, isComplete }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-[#050816] flex flex-col items-center justify-center z-50"
        initial={{ opacity: 1 }}
        animate={{ opacity: isComplete ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <div className="relative mb-8">
          <div className="loader">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span 
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {Math.round(progress)}%
            </motion.span>
          </div>
        </div>
        
        <motion.p
          className="text-white/80 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Loading NexusAI...
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}