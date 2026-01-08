import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { Button, Layout, Card } from '../components/common';
import { getMBTIResult } from '../constants/mbtiResults';
import { useStatsStore } from '../stores/statsStore';
import { useTestStore } from '../stores/testStore';
import { MBTIType } from '../types';

export function ResultPage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const resultRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const { reset } = useTestStore();
  const { getPercentage, getRank } = useStatsStore();

  const mbtiType = type?.toUpperCase() as MBTIType;
  const result = getMBTIResult(mbtiType);

  if (!result) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-gray-600 mb-4">결과를 찾을 수 없습니다</p>
          <Button onClick={() => navigate('/')}>홈으로 돌아가기</Button>
        </div>
      </Layout>
    );
  }

  const percentage = getPercentage(mbtiType);
  const rank = getRank(mbtiType);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const handleSaveImage = async () => {
    if (!resultRef.current) return;

    setIsSharing(true);
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#6366F1',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `MBTI-결과-${mbtiType}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('이미지가 저장되었습니다!');
    } catch {
      showToast('이미지 저장에 실패했습니다');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      showToast('링크가 복사되었습니다!');
    } catch {
      showToast('링크 복사에 실패했습니다');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `나는 ${mbtiType}! - MBTI 찐테스트`,
          text: `${result.nickname} - ${result.summary}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const handleRetake = () => {
    reset();
    navigate('/test');
  };

  return (
    <Layout className="bg-gray-50">
      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          {toast}
        </motion.div>
      )}

      <div className="py-4 space-y-6">
        {/* Result Card for Sharing */}
        <div ref={resultRef} className="gradient-bg rounded-2xl p-6 text-white text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-white/80 text-sm mb-2">당신은</p>
            <h1 className="text-5xl font-bold mb-2">{result.type}</h1>
            <h2 className="text-xl font-semibold mb-4">{result.nickname}</h2>
            <p className="text-white/90 text-lg leading-relaxed">"{result.summary}"</p>

            <div className="flex justify-center gap-4 mt-6 text-sm">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="block font-bold text-lg">{percentage}%</span>
                <span className="text-white/80">전체 비율</span>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="block font-bold text-lg">{rank}위</span>
                <span className="text-white/80">인기 순위</span>
              </div>
            </div>

            <p className="mt-4 text-xs text-white/60">mbti-test.vercel.app</p>
          </motion.div>
        </div>

        {/* Characteristics */}
        <Card>
          <h3 className="text-lg font-bold text-gray-800 mb-4">당신의 특징</h3>
          <ul className="space-y-2">
            {result.characteristics.map((char, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-gray-700"
              >
                {char}
              </motion.li>
            ))}
          </ul>
        </Card>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="!p-4">
            <h3 className="text-sm font-bold text-green-600 mb-3">💪 강점</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {result.strengths.map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </Card>
          <Card className="!p-4">
            <h3 className="text-sm font-bold text-orange-500 mb-3">🤔 약점</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {result.weaknesses.map((w, i) => (
                <li key={i}>• {w}</li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Recommended Jobs */}
        <Card>
          <h3 className="text-lg font-bold text-gray-800 mb-4">💼 추천 직업</h3>
          <div className="flex flex-wrap gap-2">
            {result.recommendedJobs.map((job, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
              >
                {job}
              </span>
            ))}
          </div>
        </Card>

        {/* Celebrities */}
        <Card>
          <h3 className="text-lg font-bold text-gray-800 mb-4">⭐ 같은 MBTI 유명인</h3>
          <div className="flex flex-wrap gap-2">
            {result.celebrities.map((celeb, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm"
              >
                {celeb}
              </span>
            ))}
          </div>
        </Card>

        {/* Share Buttons */}
        <Card className="space-y-3">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📤 결과 공유하기</h3>

          <Button
            onClick={handleSaveImage}
            variant="primary"
            fullWidth
            disabled={isSharing}
          >
            {isSharing ? '저장 중...' : '🖼️ 이미지로 저장'}
          </Button>

          <Button onClick={handleShare} variant="secondary" fullWidth>
            📱 공유하기
          </Button>

          <Button onClick={handleCopyLink} variant="ghost" fullWidth>
            🔗 링크 복사
          </Button>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={handleRetake} variant="secondary" className="flex-1">
            다시 테스트하기
          </Button>
          <Button onClick={() => navigate('/stats')} variant="secondary" className="flex-1">
            전체 통계 보기
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-8">
          재미로 즐기는 테스트입니다
        </p>
      </div>
    </Layout>
  );
}
