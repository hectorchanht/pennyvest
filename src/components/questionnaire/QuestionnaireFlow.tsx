'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth/client';
import { sections, calculateResult } from '@/lib/questionnaire/questions';
import type { QuestionnaireResult } from '@/lib/questionnaire/types';
import { Button } from '@/components/ui/button';
import QuestionCard from './QuestionCard';
import ReviewCard from './ReviewCard';

const allQuestions = sections.flatMap((section) =>
  section.questions.map((q) => ({ ...q, sectionId: section.id, sectionName: section.name }))
);

type FlowState = 'loading' | 'quiz' | 'review';

export default function QuestionnaireFlow() {
  const t = useTranslations('questionnaire');
  const session = authClient.useSession();
  const router = useRouter();
  const [flowState, setFlowState] = useState<FlowState>('loading');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({});
  const [result, setResult] = useState<QuestionnaireResult | null>(null);
  const [saving, setSaving] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!session.isPending && !session.data?.user) {
      const callbackUrl = encodeURIComponent('/questionnaire');
      router.push(`/auth/sign-in?callbackUrl=${callbackUrl}` as '/auth/sign-in');
    }
  }, [session.isPending, session.data, router]);

  // Fetch existing result on mount
  useEffect(() => {
    if (session.isPending || !session.data?.user) return;

    fetch('/api/questionnaire')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.answers) {
          setAnswers(data.answers);
          setResult(data.result);
          setFlowState('review');
        } else {
          setFlowState('quiz');
        }
      })
      .catch(() => {
        setFlowState('quiz');
      });
  }, [session.isPending, session.data]);

  const saveToDb = useCallback(async (ans: Record<string, number | number[]>) => {
    setSaving(true);
    try {
      const res = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: ans }),
      });
      const data = await res.json();
      if (data.result) {
        setResult(data.result);
      }
    } catch {
      // Silent fail — result is already calculated client-side
    } finally {
      setSaving(false);
    }
  }, []);

  const currentQuestion = allQuestions[step];
  const totalQuestions = allQuestions.length;
  const progress = flowState === 'review' ? 100 : ((step) / totalQuestions) * 100;

  function handleSelect(indices: number | number[]) {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: indices }));
  }

  const currentSelectedIndices = useMemo(() => {
    if (!currentQuestion) return undefined;
    return answers[currentQuestion.id];
  }, [currentQuestion, answers]);

  const hasAnswer = currentQuestion ? answers[currentQuestion.id] !== undefined : false;

  function handleNext() {
    if (step < totalQuestions - 1) {
      setStep(step + 1);
    } else {
      // Quiz complete — calculate and save
      const calcResult = calculateResult(answers);
      setResult(calcResult);
      saveToDb(answers);
      setFlowState('review');
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  function handleAnswerChange(questionId: string, value: number | number[]) {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    const newResult = calculateResult(newAnswers);
    setResult(newResult);
    saveToDb(newAnswers);
  }

  function handleRetake() {
    setAnswers({});
    setResult(null);
    setStep(0);
    setFlowState('quiz');
  }

  // Loading states
  if (session.isPending || flowState === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-muted">{t('loading')}</p>
      </div>
    );
  }

  if (!session.data?.user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-muted">{t('redirecting')}</p>
      </div>
    );
  }

  // Review state — show past results with edit capability
  if (flowState === 'review' && result) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8">
        {saving && (
          <div className="mb-4 text-center text-xs text-text-muted">
            {t('saving')}
          </div>
        )}
        <ReviewCard
          answers={answers}
          result={result}
          onAnswerChange={handleAnswerChange}
          onRetake={handleRetake}
        />
      </div>
    );
  }

  // Quiz state — step through questions
  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <div className="mb-8 space-y-2">
        <div className="h-1.5 w-full rounded-full bg-surface overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-green transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-text-muted text-right">
          {step + 1} / {totalQuestions}
        </p>
      </div>

      {currentQuestion ? (
        <>
          <QuestionCard
            question={currentQuestion}
            translatedText={t(`q.${currentQuestion.id}.text`)}
            translatedHint={t.has(`q.${currentQuestion.id}.hint`) ? t(`q.${currentQuestion.id}.hint`) : undefined}
            translatedOptions={currentQuestion.options.map((_, i) => t(`q.${currentQuestion.id}.o.${i}`))}
            sectionName={t(`sections.${currentQuestion.sectionId}` as 'sections.capacity')}
            questionIndex={step}
            totalQuestions={totalQuestions}
            selectedIndices={currentSelectedIndices}
            onSelect={handleSelect}
          />

          <div className="mt-8 flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 0}
            >
              {t('back')}
            </Button>
            <Button
              className="bg-brand-green text-black hover:bg-brand-green/90"
              onClick={handleNext}
              disabled={!hasAnswer}
            >
              {step === totalQuestions - 1 ? t('seeResults') : t('next')}
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}
