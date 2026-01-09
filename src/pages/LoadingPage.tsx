import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/common';
import { useTestStore } from '../stores/testStore';
import { useStatsStore } from '../stores/statsStore';

export function LoadingPage() {
  const navigate = useNavigate();
  const { calculateResult, result } = useTestStore();
  const { incrementType } = useStatsStore();
  const [progress, setProgress] = useState(0);

  const loadingTexts = [
    '답변을 분석하고 있어요',
    '성격 유형을 파악하는 중',
    '결과를 준비하고 있어요',
  ];

  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 700);

    const timer = setTimeout(() => {
      const mbtiResult = result || calculateResult();
      if (!result) {
        incrementType(mbtiResult);
      }
      navigate(`/result/${mbtiResult}`);
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
      clearTimeout(timer);
    };
  }, [calculateResult, incrementType, navigate, result]);

  return (
    <Layout className="bg-neutral-50">
      <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center text-center">
        {/* Minimal Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12"
        >
          <div className="relative w-16 h-16">
            <motion.div
              className="absolute inset-0 border-2 border-neutral-200 rounded-full"
            />
            <motion.div
              className="absolute inset-0 border-2 border-neutral-900 rounded-full"
              style={{ borderRightColor: 'transparent', borderBottomColor: 'transparent' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.p
          key={textIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="text-lg font-medium text-neutral-900 mb-8"
        >
          {loadingTexts[textIndex]}
        </motion.p>

        {/* Progress Bar */}
        <div className="w-48">
          <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-neutral-900 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="mt-3 text-neutral-400 text-sm tabular-nums">{progress}%</p>
        </div>
      </div>
    </Layout>
  );
}
