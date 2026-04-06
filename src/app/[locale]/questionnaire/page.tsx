import { setRequestLocale } from 'next-intl/server';
import QuestionnaireFlow from '@/components/questionnaire/QuestionnaireFlow';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function QuestionnairePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <QuestionnaireFlow />;
}
