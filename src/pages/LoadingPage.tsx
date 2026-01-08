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
    '당신의 답변을 분석 중...',
    '성격 유형을 파악하는 중...',
    '결과를 준비하는 중...',
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
    <Layout className="gradient-bg">
      <div className="min-h-screen flex flex-col items-center justify-center text-white text-center">
        {/* Loading Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <div className="relative w-24 h-24">
            <motion.div
              className="absolute inset-0 border-4 border-white/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-2 border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🔮</span>
            </div>
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          key={textIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xl font-semibold mb-6"
        >
          {loadingTexts[textIndex]}
        </motion.h2>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <p className="mt-2 text-white/80 text-sm">{progress}%</p>
      </div>
    </Layout>
  );
}
