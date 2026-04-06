import { setRequestLocale } from 'next-intl/server';
import ProfilePage from '@/components/profile/ProfilePage';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function UserProfilePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProfilePage />;
}
