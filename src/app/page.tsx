import { Typography } from '@heroui/react';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <Typography>{t('displayText')}</Typography>
    </div>
  );
}
