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
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]">
          <p className="text-neutral-500 mb-6">결과를 찾을 수 없습니다</p>
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
        backgroundColor: '#171717',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `MBTI-${mbtiType}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('이미지가 저장되었습니다');
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
      showToast('링크가 복사되었습니다');
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
    <Layout className="bg-neutral-50">
      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white px-5 py-3 rounded-xl text-sm font-medium"
        >
          {toast}
        </motion.div>
      )}

      <div className="space-y-8">
        {/* Result Card for Sharing */}
        <div ref={resultRef} className="bg-neutral-900 rounded-2xl p-8 md:p-10 text-white text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className="text-neutral-400 text-sm mb-4">당신은</p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">{result.type}</h1>
            <h2 className="text-xl font-medium text-neutral-200 mb-6">{result.nickname}</h2>
            <p className="text-neutral-300 text-lg leading-relaxed max-w-sm mx-auto">
              "{result.summary}"
            </p>

            <div className="flex justify-center gap-6 mt-8">
              <div className="text-center">
                <span className="block text-2xl font-bold">{percentage}%</span>
                <span className="text-neutral-400 text-sm">전체 비율</span>
              </div>
              <div className="w-px bg-neutral-700" />
              <div className="text-center">
                <span className="block text-2xl font-bold">{rank}위</span>
                <span className="text-neutral-400 text-sm">인기 순위</span>
              </div>
            </div>

            <p className="mt-8 text-xs text-neutral-500">mbti-test.vercel.app</p>
          </motion.div>
        </div>

        {/* Characteristics */}
        <Card>
          <h3 className="text-lg font-bold text-neutral-900 mb-6">당신의 특징</h3>
          <ul className="space-y-3">
            {result.characteristics.map((char, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
                className="text-neutral-600 leading-relaxed"
              >
                {char}
              </motion.li>
            ))}
          </ul>
        </Card>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="!p-6">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">강점</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              {result.strengths.map((s, i) => (
                <li key={i} className="leading-relaxed">{s}</li>
              ))}
            </ul>
          </Card>
          <Card className="!p-6">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">약점</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              {result.weaknesses.map((w, i) => (
                <li key={i} className="leading-relaxed">{w}</li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Recommended Jobs */}
        <Card>
          <h3 className="text-lg font-bold text-neutral-900 mb-6">추천 직업</h3>
          <div className="flex flex-wrap gap-2">
            {result.recommendedJobs.map((job, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-full text-sm font-medium"
              >
                {job}
              </span>
            ))}
          </div>
        </Card>

        {/* Celebrities */}
        <Card>
          <h3 className="text-lg font-bold text-neutral-900 mb-6">같은 MBTI 유명인</h3>
          <div className="flex flex-wrap gap-2">
            {result.celebrities.map((celeb, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-full text-sm font-medium"
              >
                {celeb}
              </span>
            ))}
          </div>
        </Card>

        {/* Share Buttons */}
        <Card className="space-y-3">
          <h3 className="text-lg font-bold text-neutral-900 mb-6">결과 공유하기</h3>

          <Button
            onClick={handleSaveImage}
            variant="primary"
            fullWidth
            disabled={isSharing}
          >
            {isSharing ? '저장 중...' : '이미지로 저장'}
          </Button>

          <Button onClick={handleShare} variant="secondary" fullWidth>
            공유하기
          </Button>

          <Button onClick={handleCopyLink} variant="ghost" fullWidth>
            링크 복사
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
        <p className="text-center text-sm text-neutral-300 pt-4">
          재미로 즐기는 테스트입니다
        </p>
      </div>
    </Layout>
  );
}
