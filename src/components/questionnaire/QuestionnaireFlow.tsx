'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth/client';
import { sections, calculateResult } from '@/lib/questionnaire/questions';
import type { QuestionnaireResult } from '@/lib/questionnaire/types';
import { Button } from '@/components/ui/button';
import QuestionCard from './QuestionCard';
import ResultsCard from './ResultsCard';

// Flatten all questions with section info
const allQuestions = sections.flatMap((section) =>
  section.questions.map((q) => ({ ...q, sectionName: section.name }))
);

export default function QuestionnaireFlow() {
  const session = authClient.useSession();
  const router = useRouter();
  const [step, setStep] = useState(0); // 0-based index into allQuestions
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({});
  const [result, setResult] = useState<QuestionnaireResult | null>(null);

  // Auth guard: redirect to sign-in if not logged in
  useEffect(() => {
    if (!session.isPending && !session.data?.user) {
      const callbackUrl = encodeURIComponent('/questionnaire');
      router.push(`/auth/sign-in?callbackUrl=${callbackUrl}` as '/auth/sign-in');
    }
  }, [session.isPending, session.data, router]);

  const currentQuestion = allQuestions[step];
  const totalQuestions = allQuestions.length;
  const progress = result ? 100 : ((step) / totalQuestions) * 100;

  // Convert index-based selection to score for storage
  function handleSelect(indices: number | number[]) {
    if (!currentQuestion) return;
    const q = currentQuestion;
    if (q.multiSelect && Array.isArray(indices)) {
      const scores = indices.map((i) => q.options[i]!.score);
      setAnswers((prev) => ({ ...prev, [q.id]: scores }));
    } else if (typeof indices === 'number') {
      setAnswers((prev) => ({ ...prev, [q.id]: q.options[indices]!.score }));
    }
  }

  // Get current selection as indices for QuestionCard
  const currentSelectedIndices = useMemo(() => {
    if (!currentQuestion) return undefined;
    const answer = answers[currentQuestion.id];
    if (answer === undefined) return undefined;
    if (currentQuestion.multiSelect && Array.isArray(answer)) {
      // Map scores back to indices
      const used = new Set<number>();
      return answer.map((score) => {
        const idx = currentQuestion.options.findIndex(
          (o, i) => o.score === score && !used.has(i)
        );
        if (idx >= 0) used.add(idx);
        return idx;
      });
    }
    // Single select: find option index by score
    return currentQuestion.options.findIndex((o) => o.score === answer);
  }, [currentQuestion, answers]);

  const hasAnswer = currentQuestion ? answers[currentQuestion.id] !== undefined : false;

  function handleNext() {
    if (step < totalQuestions - 1) {
      setStep(step + 1);
    } else {
      // Calculate result
      setResult(calculateResult(answers));
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  // Show loading while checking auth
  if (session.isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  // Don't render questionnaire if not logged in (redirect happening)
  if (!session.data?.user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-muted">Redirecting to sign in...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      {/* Progress bar */}
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
      ) : (
        <>
          <QuestionCard
            question={currentQuestion}
            sectionName={currentQuestion.sectionName}
            questionIndex={step}
            totalQuestions={totalQuestions}
            selectedIndices={currentSelectedIndices}
            onSelect={handleSelect}
          />

          {/* Navigation */}
          <div className="mt-8 flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 0}
            >
              Back
            </Button>
            <Button
              className="bg-brand-green text-black hover:bg-brand-green/90"
              onClick={handleNext}
              disabled={!hasAnswer}
            >
              {step === totalQuestions - 1 ? 'See Results' : 'Next'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
