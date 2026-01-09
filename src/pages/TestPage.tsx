import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, Layout, ProgressBar } from '../components/common';
import { QUESTIONS, TOTAL_QUESTIONS } from '../constants/questions';
import { useTestStore } from '../stores/testStore';
import { useStatsStore } from '../stores/statsStore';
import { Answer } from '../types';

export function TestPage() {
  const navigate = useNavigate();
  const { currentQuestion, answers, addAnswer, updateAnswer, setCurrentQuestion, calculateResult } = useTestStore();
  const { incrementType } = useStatsStore();
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const question = QUESTIONS[currentQuestion];
  const existingAnswer = answers.find((a) => a.questionId === question?.id);

  useEffect(() => {
    if (existingAnswer) {
      setSelectedOption(existingAnswer.selected);
    } else {
      setSelectedOption(null);
    }
  }, [currentQuestion, existingAnswer]);

  const handleSelect = (option: 'A' | 'B') => {
    if (isTransitioning) return;

    setSelectedOption(option);
    setIsTransitioning(true);

    const answer: Answer = {
      questionId: question.id,
      selected: option,
      dimension: option === 'A' ? question.optionA.type : question.optionB.type,
    };

    setTimeout(() => {
      if (existingAnswer) {
        updateAnswer(question.id, answer);
      } else {
        addAnswer(answer);
      }

      if (currentQuestion === TOTAL_QUESTIONS - 1) {
        navigate('/loading');
      }

      setIsTransitioning(false);
    }, 300);
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleComplete = () => {
    const result = calculateResult();
    incrementType(result);
    navigate(`/result/${result}`);
  };

  if (!question) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-neutral-500">문제가 발생했습니다.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout className="bg-neutral-50">
      <div className="pt-4 pb-8">
        {/* Progress Bar */}
        <ProgressBar current={currentQuestion + 1} total={TOTAL_QUESTIONS} />

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="mt-12"
          >
            {/* Question Number */}
            <div className="mb-8">
              <span className="text-sm font-medium text-neutral-400 tracking-wide">
                Q{currentQuestion + 1}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 leading-relaxed tracking-tight mb-12">
              {question.text}
            </h2>

            {/* Options */}
            <div className="space-y-4">
              <motion.button
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelect('A')}
                disabled={isTransitioning}
                className={`w-full p-6 text-left rounded-2xl border transition-all duration-200 ${
                  selectedOption === 'A'
                    ? 'border-neutral-900 bg-neutral-50'
                    : 'border-neutral-200 bg-white hover:border-neutral-400'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 transition-colors ${
                      selectedOption === 'A'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    A
                  </span>
                  <span className="text-neutral-800 font-medium leading-relaxed pt-1">
                    {question.optionA.text}
                  </span>
                </div>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelect('B')}
                disabled={isTransitioning}
                className={`w-full p-6 text-left rounded-2xl border transition-all duration-200 ${
                  selectedOption === 'B'
                    ? 'border-neutral-900 bg-neutral-50'
                    : 'border-neutral-200 bg-white hover:border-neutral-400'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 transition-colors ${
                      selectedOption === 'B'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    B
                  </span>
                  <span className="text-neutral-800 font-medium leading-relaxed pt-1">
                    {question.optionB.text}
                  </span>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-12">
          <Button
            onClick={handlePrev}
            variant="secondary"
            disabled={currentQuestion === 0}
            className="flex-1"
          >
            이전
          </Button>

          {currentQuestion === TOTAL_QUESTIONS - 1 && answers.length === TOTAL_QUESTIONS && (
            <Button onClick={handleComplete} variant="primary" className="flex-1">
              결과 보기
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
}
