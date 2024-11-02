"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PoolCardProps {
  icon: string;
  title: string;
  chain: string;
  totalLocked: string;
  poolBalance: number;
  apr: number;
  project: string;
  boostedApr: number;
  onManage?: () => void;
}

interface TooltipProps {
  children: React.ReactNode;
  tooltip: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, tooltip }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-10"
          >
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatDisplay: React.FC<{ label: string; value: string; tooltip?: string }> = ({
  label,
  value,
  tooltip
}) => {
  const content = (
    <motion.div 
      className="flex flex-col"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {tooltip ? (
        <Tooltip tooltip={tooltip}>
          <span className="text-sm font-bold text-gray-400">{label} (?)</span>
        </Tooltip>
      ) : (
        <span className="text-sm font-bold text-gray-400">{label}</span>
      )}
      <motion.span 
        className="text-base font-bold text-black"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {value}
      </motion.span>
    </motion.div>
  );

  return content;
};

export const PoolCard: React.FC<PoolCardProps> = ({
  icon,
  title,
  chain,
  totalLocked,
  poolBalance,
  apr,
  project,
  boostedApr,
  onManage
}) => {
  const validatePercentage = (value: number): string => {
    return `${Math.min(Math.max(value, 0), 100).toFixed(2)}%`;
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)"
      }}
      className="bg-gray-200 p-4 rounded-xl gap-4 border-b pb-4 flex flex-col"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div 
        className="flex items-center justify-between flex-row space-x-2"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          className="w-8 h-8"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <img 
            src={icon} 
            alt={title} 
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.png';
            }}
          />
        </motion.div>
        <div>
          <motion.div 
            className="font-bold"
            animate={{ color: isHovered ? "#000" : "#1a1a1a" }}
          >
            {title}
          </motion.div>
          <motion.div 
            className="text-gray-500 font-bold"
            animate={{ opacity: isHovered ? 1 : 0.8 }}
          >
            {chain}/{project}
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        className="flex flex-row items-center justify-between space-y-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <StatDisplay 
          label="Total Locked"
          value={totalLocked}
        />
        
        <StatDisplay 
          label="Pool Balance"
          value={validatePercentage(poolBalance)}
          tooltip="The current balance in the pool"
        />
        
        <StatDisplay 
          label="APR"
          value={validatePercentage(apr)}
          tooltip="Annual Percentage Rate"
        />
        
        <StatDisplay 
          label="Boosted APR"
          value={validatePercentage(boostedApr)}
          tooltip="Enhanced APR with additional rewards"
        />
      </motion.div>
      
      <motion.button 
        onClick={onManage}
        className="mt-4 w-full bg-black font-bold text-white py-2 rounded-xl"
        whileHover={{ 
          scale: 1.02,
          backgroundColor: "#1a1a1a"
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: 0.4,
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      >
        Stats
      </motion.button>
    </motion.div>
  );
};

export default PoolCard;
