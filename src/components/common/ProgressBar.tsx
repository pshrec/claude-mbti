import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-neutral-400">Progress</span>
        <span className="text-sm font-medium text-neutral-900 tabular-nums">
          {current} / {total}
        </span>
      </div>
      <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-neutral-900 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  );
}
