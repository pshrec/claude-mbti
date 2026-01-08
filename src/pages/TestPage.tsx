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
    }, 400);
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
          <p>문제가 발생했습니다.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout className="bg-gray-50">
      <div className="pt-4 pb-8">
        {/* Progress Bar */}
        <ProgressBar current={currentQuestion + 1} total={TOTAL_QUESTIONS} />

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            {/* Question Text */}
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mb-4">
                Q{currentQuestion + 1}
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed">
                {question.text}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect('A')}
                disabled={isTransitioning}
                className={`w-full p-5 text-left bg-white rounded-xl border-2 transition-all duration-200 ${
                  selectedOption === 'A'
                    ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      selectedOption === 'A'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    A
                  </span>
                  <span className="text-gray-800 font-medium">{question.optionA.text}</span>
                </div>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect('B')}
                disabled={isTransitioning}
                className={`w-full p-5 text-left bg-white rounded-xl border-2 transition-all duration-200 ${
                  selectedOption === 'B'
                    ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      selectedOption === 'B'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    B
                  </span>
                  <span className="text-gray-800 font-medium">{question.optionB.text}</span>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
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
