'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

interface QuizResult {
  answers: Record<string, unknown>;
  result: {
    overallScore: number;
    riskBand: string;
    profileSlug: string;
  };
}

export default function ProfilePage() {
  const t = useTranslations('userProfile');
  const tAuth = useTranslations('auth');
  const session = authClient.useSession();
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(true);

  useEffect(() => {
    if (!session.data?.user) {
      setLoadingQuiz(false);
      return;
    }

    fetch('/api/questionnaire')
      .then((res) => res.json())
      .then((data) => {
        if (data?.result) setQuizResult(data);
      })
      .catch(() => {})
      .finally(() => setLoadingQuiz(false));
  }, [session.data]);

  // Not logged in — prompt to sign in
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

  // Loading
  if (session.isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-muted">{tAuth('signingIn')}</p>
      </div>
    );
  }

  const user = session.data!.user;

  return (
    <div className="mx-auto max-w-lg px-4 py-8 space-y-6">
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

      {/* Risk Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('riskProfile')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingQuiz ? (
            <p className="text-sm text-text-muted">...</p>
          ) : quizResult ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold text-text-primary">
                    {quizResult.result.riskBand}
                  </p>
                  <p className="text-sm text-text-secondary">
                    Score: {quizResult.result.overallScore}/100
                  </p>
                </div>
                <div className="text-right">
                  <Link href="/questionnaire">
                    <Button variant="outline" size="sm">
                      {t('retakeQuiz')}
                    </Button>
                  </Link>
                </div>
              </div>
              <Link href="/profiles">
                <Button
                  className="w-full bg-brand-green text-black hover:bg-brand-green/90"
                  size="lg"
                >
                  {t('viewPortfolio')}
                </Button>
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm text-text-muted">{t('notAssessed')}</p>
              <Link href="/questionnaire">
                <Button
                  className="w-full bg-brand-green text-black hover:bg-brand-green/90"
                  size="lg"
                >
                  {t('takeQuiz')}
                </Button>
              </Link>
            </>
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
