import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, Layout } from '../components/common';
import { useStatsStore } from '../stores/statsStore';
import { useTestStore } from '../stores/testStore';

export function LandingPage() {
  const navigate = useNavigate();
  const { stats } = useStatsStore();
  const { reset, isCompleted, result } = useTestStore();

  const handleStart = () => {
    reset();
    navigate('/test');
  };

  const handleContinue = () => {
    if (isCompleted && result) {
      navigate(`/result/${result}`);
    } else {
      navigate('/test');
    }
  };

  const features = [
    { title: '3분', desc: '간단한 테스트' },
    { title: '12문항', desc: 'MZ세대 맞춤' },
    { title: '무료', desc: '가입 불필요' },
    { title: '공유', desc: '이미지 저장' },
  ];

  return (
    <Layout className="bg-neutral-50">
      <div className="min-h-[calc(100vh-6rem)] flex flex-col justify-center">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight tracking-tight mb-6">
            3분 만에 끝나는
            <br />
            MBTI 찐테스트
          </h1>
          <p className="text-lg text-neutral-500 mb-12">
            12개 질문으로 알아보는 내 진짜 성격
          </p>

          <div className="flex flex-col gap-3">
            <Button onClick={handleStart} variant="primary" size="lg" fullWidth>
              테스트 시작하기
            </Button>

            {isCompleted && result && (
              <Button onClick={handleContinue} variant="ghost" size="md" fullWidth>
                이전 결과 보기 ({result})
              </Button>
            )}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-16"
        >
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
                className="p-6 bg-white rounded-2xl border border-neutral-100"
              >
                <p className="text-2xl font-bold text-neutral-900 mb-1">{feature.title}</p>
                <p className="text-sm text-neutral-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center"
        >
          <p className="text-neutral-400 text-sm">
            지금까지{' '}
            <span className="font-semibold text-neutral-900">
              {stats.totalCount.toLocaleString()}
            </span>
            명이 참여했어요
          </p>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-auto pt-16 text-center"
        >
          <p className="text-neutral-300 text-xs">
            재미로 즐기는 테스트입니다
          </p>
        </motion.footer>
      </div>
    </Layout>
  );
}
