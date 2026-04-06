'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth/client';
import { sections, calculateResult } from '@/lib/questionnaire/questions';
import type { QuestionnaireResult } from '@/lib/questionnaire/types';
import { Button } from '@/components/ui/button';
import QuestionCard from './QuestionCard';
import ResultsCard from './ResultsCard';

// Flatten all questions with section info
const allQuestions = sections.flatMap((section) =>
  section.questions.map((q) => ({ ...q, sectionId: section.id, sectionName: section.name }))
);

export default function QuestionnaireFlow() {
  const t = useTranslations('questionnaire');
  const session = authClient.useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({});
  const [result, setResult] = useState<QuestionnaireResult | null>(null);

  useEffect(() => {
    if (!session.isPending && !session.data?.user) {
      const callbackUrl = encodeURIComponent('/questionnaire');
      router.push(`/auth/sign-in?callbackUrl=${callbackUrl}` as '/auth/sign-in');
    }
  }, [session.isPending, session.data, router]);

  const currentQuestion = allQuestions[step];
  const totalQuestions = allQuestions.length;
  const progress = result ? 100 : ((step) / totalQuestions) * 100;

  // Store indices directly — convert to scores only at calculation time
  function handleSelect(indices: number | number[]) {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: indices }));
  }

  // Answers are stored as indices already
  const currentSelectedIndices = useMemo(() => {
    if (!currentQuestion) return undefined;
    return answers[currentQuestion.id];
  }, [currentQuestion, answers]);

  const hasAnswer = currentQuestion ? answers[currentQuestion.id] !== undefined : false;

  function handleNext() {
    if (step < totalQuestions - 1) {
      setStep(step + 1);
    } else {
      setResult(calculateResult(answers));
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  if (session.isPending) {
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

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <div className="mb-8 space-y-2">
        <div className="h-1.5 w-full rounded-full bg-surface overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-green transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        {!result && (
          <p className="text-xs text-text-muted text-right">
            {step + 1} / {totalQuestions}
          </p>
        )}
      </div>

      {result ? (
        <ResultsCard result={result} />
      ) : currentQuestion ? (
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
