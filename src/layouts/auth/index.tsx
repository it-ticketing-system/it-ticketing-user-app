import { useTranslations } from 'next-intl';
import { DImage } from '@/components/shared';

const AuthLayout: FCC = ({ children }) => {
  const t = useTranslations('auth.layout');

  return (
    <main className="bg-background mx-auto min-h-dvh w-full max-w-7xl px-4 py-6 sm:px-5 md:px-6 lg:px-8">
      <div className="bg-surface border-border flex min-h-[calc(100dvh-3rem)] w-full flex-col-reverse overflow-hidden rounded-xl border shadow-sm lg:min-h-160 lg:flex-row">
        <section className="flex w-full shrink-0 items-center justify-center px-6 py-6 lg:w-[54%] lg:flex-1 lg:px-8 lg:py-8">
          {children}
        </section>

        <section
          id="auth-image"
          aria-label={t('imageLabel')}
          className="bg-surface-secondary relative flex min-h-40 w-full flex-1 items-center justify-center overflow-hidden lg:min-h-160 lg:w-[46%] lg:flex-none"
        >
          <DImage
            src="/auth/auth-bg.png"
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 46vw"
            className="object-cover"
            loading="eager"
            fetchPriority="high"
          />

          <div className="absolute inset-4 z-10 md:inset-6 lg:inset-8">
            <DImage
              src="/auth/auth-hero.png"
              alt={t('heroAlt')}
              fill
              sizes="(max-width: 767px) 80vw, 42vw"
              className="object-contain"
              loading="eager"
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;
