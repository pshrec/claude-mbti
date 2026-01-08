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
    { icon: '⚡', title: '초스피드', desc: '단 3분이면 충분!' },
    { icon: '😂', title: '재미 보장', desc: 'MZ세대 맞춤 질문' },
    { icon: '🖼️', title: '공유 편리', desc: '결과를 이미지로 저장' },
    { icon: '🚀', title: '가입 불필요', desc: '클릭 한 번으로 시작' },
  ];

  return (
    <Layout className="gradient-bg">
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-white py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            3분 만에 끝나는
            <br />
            MBTI 찐테스트
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            12개 질문으로 알아보는 내 진짜 성격
          </p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleStart}
              variant="secondary"
              size="lg"
              className="!text-primary-600 !font-bold"
            >
              테스트 시작하기
            </Button>

            {isCompleted && result && (
              <Button
                onClick={handleContinue}
                variant="ghost"
                size="md"
                className="!text-white/80 hover:!text-white"
              >
                이전 결과 보기 ({result})
              </Button>
            )}
          </div>

          {/* Stats Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-white/80"
          >
            <p className="text-sm">
              지금까지{' '}
              <span className="font-bold text-white text-lg">
                {stats.totalCount.toLocaleString()}
              </span>
              명이 테스트했어요!
            </p>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center"
              >
                <span className="text-3xl mb-2 block">{feature.icon}</span>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm opacity-80">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-white/60 text-sm"
        >
          <p>재미로 즐기는 테스트입니다</p>
          <p className="mt-1">© 2024 MBTI 찐테스트</p>
        </motion.footer>
      </div>
    </Layout>
  );
}
