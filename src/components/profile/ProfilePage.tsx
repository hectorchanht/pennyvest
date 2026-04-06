'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { authClient } from '@/lib/auth/client';
import { calculateResult } from '@/lib/questionnaire/questions';
import type { QuestionnaireResult } from '@/lib/questionnaire/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';
import ReviewCard from '@/components/questionnaire/ReviewCard';

export default function ProfilePage() {
  const t = useTranslations('userProfile');
  const tAuth = useTranslations('auth');
  const session = authClient.useSession();
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({});
  const [result, setResult] = useState<QuestionnaireResult | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session.data?.user) {
      setLoadingQuiz(false);
      return;
    }

    fetch('/api/questionnaire')
      .then((res) => res.json())
      .then((data) => {
        if (data?.result && data?.answers) {
          setAnswers(data.answers);
          setResult(data.result);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingQuiz(false));
  }, [session.data]);

  const saveToDb = useCallback(async (ans: Record<string, number | number[]>) => {
    setSaving(true);
    try {
      const res = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: ans }),
      });
      const data = await res.json();
      if (data.result) setResult(data.result);
    } catch {
      // Silent fail
    } finally {
      setSaving(false);
    }
  }, []);

  function handleAnswerChange(questionId: string, value: number | number[]) {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    const newResult = calculateResult(newAnswers);
    setResult(newResult);
    saveToDb(newAnswers);
  }

  function handleRetake() {
    // Navigate to questionnaire in fresh quiz mode
    window.location.href = '/questionnaire';
  }

  // Not logged in
  if (!session.isPending && !session.data?.user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-surface flex items-center justify-center">
            <User className="size-8 text-text-muted" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">{t('title')}</h1>
          <p className="text-sm text-text-secondary">{t('signInPrompt')}</p>
          <Link href="/auth/sign-in?callbackUrl=/profile">
            <Button
              className="w-full bg-brand-green text-black hover:bg-brand-green/90"
              size="lg"
            >
              {t('signInButton')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (session.isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-muted">{tAuth('signingIn')}</p>
      </div>
    );
  }

  const user = session.data!.user;

  return (
    <div className="mx-auto max-w-xl px-4 py-8 space-y-6">
      {/* User info */}
      <div className="text-center space-y-3">
        <div className="mx-auto w-16 h-16 rounded-full bg-brand-green/20 flex items-center justify-center">
          <span className="text-2xl font-bold text-brand-green">
            {(user.name || user.email)?.[0]?.toUpperCase() || '?'}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary">
          {user.name || user.email}
        </h1>
      </div>

      {/* Account details */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          {user.name && (
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">{t('name')}</span>
              <span className="text-text-primary">{user.name}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">{t('email')}</span>
            <span className="text-text-primary">{user.email}</span>
          </div>
          {user.createdAt && (
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">{t('memberSince')}</span>
              <span className="text-text-primary">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risk Profile — full questionnaire review or CTA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('riskProfile')}</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingQuiz ? (
            <p className="text-sm text-text-muted">...</p>
          ) : result ? (
            <>
              {saving && (
                <p className="text-center text-xs text-text-muted mb-4">
                  {t('saving') ?? '...'}
                </p>
              )}
              <ReviewCard
                answers={answers}
                result={result}
                onAnswerChange={handleAnswerChange}
                onRetake={handleRetake}
              />
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-text-muted">{t('notAssessed')}</p>
              <Link href="/questionnaire">
                <Button
                  className="w-full bg-brand-green text-black hover:bg-brand-green/90"
                  size="lg"
                >
                  {t('takeQuiz')}
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sign out */}
      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={async () => {
          await authClient.signOut();
          window.location.href = '/';
        }}
      >
        {tAuth('signOut')}
      </Button>
    </div>
  );
}
