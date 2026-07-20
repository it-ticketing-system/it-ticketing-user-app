import { Logo } from '@/components/shared';
import { Button } from '@heroui/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const WebsiteHeader = () => {
  const t = useTranslations('header');

  return (
    <header className="bg-surface mx-auto flex h-14 max-w-7xl items-center justify-between border-b px-4 sm:px-5 md:px-6 lg:px-8 xl:h-16">
      <Link href="/" className="flex items-center gap-2">
        <Logo />
        <span className="text-h3">{t('title')}</span>
      </Link>

      <div className="flex gap-2">
        <Button variant="outline">{t('actions.login')}</Button>

        <Button>{t('actions.register')}</Button>
      </div>
    </header>
  );
};

export default WebsiteHeader;
