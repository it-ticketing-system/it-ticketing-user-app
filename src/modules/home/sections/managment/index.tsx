import { CircleCheckBig } from 'lucide-react';
import { useTranslations } from 'next-intl';
import DImage from '@/components/shared/image';
import { BREAKPOINTS } from '@/constants';
import HeroActions from './hero-actions';

const featureKeys = ['security', 'fastResponse', 'analytics'] as const;

const Management = () => {
  const t = useTranslations('home.management');

  return (
    <section
      dir="rtl"
      aria-labelledby="management-hero-title"
      className="relative isolate h-[calc(100svh-56px)] w-full overflow-hidden lg:h-[calc(100svh-64px)]"
    >
      <DImage
        aria-hidden="true"
        alt=""
        loading="eager"
        fetchPriority="high"
        className="h-full w-full object-cover"
        pictureClassName="absolute inset-0 -z-10 block"
        sources={{
          default: {
            src: '/hero/hero-mobile-bg.png',
            width: 941,
            height: 1672,
            sizes: '90vw',
          },
          variants: [
            {
              media: `(min-width: ${BREAKPOINTS.lg}px)`,
              src: '/hero/hero-desktop-bg.png',
              width: 1672,
              height: 941,
              sizes: '90vw',
            },
          ],
        }}
      />

      <div className="relative mx-auto grid h-full w-full max-w-7xl grid-cols-1 grid-rows-[auto_minmax(0,1fr)_auto] items-center gap-2 px-4 pt-4 sm:px-5 md:px-6 lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:content-center lg:gap-x-6 lg:gap-y-4 lg:px-8 lg:pt-0 xl:gap-x-10 xl:gap-y-6">
        <div className="col-start-1 row-start-1 flex w-full flex-col items-center gap-3 text-center lg:items-start lg:self-end lg:text-right xl:max-w-xl xl:gap-6">
          <h1 id="management-hero-title" className="text-h2">
            {t('title')}

            <span className="text-primary-500 block">
              {t('highlightedTitle')}
            </span>
          </h1>

          <p className="text-body-sm text-foreground-600 max-w-lg leading-6 lg:leading-7">
            {t('description')}
          </p>

          <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:justify-start xl:gap-x-6">
            {featureKeys.map((feature) => (
              <div key={feature} className="flex items-center gap-1.5">
                <CircleCheckBig
                  size={18}
                  className="text-primary-500 shrink-0"
                />

                <span className="text-body-sm whitespace-nowrap">
                  {t(`features.${feature}`)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <DImage
          alt={t('heroImageAlt')}
          className="h-auto w-[75%] max-w-80 object-contain sm:max-w-96 lg:max-h-[min(490px,calc(100svh-120px))] lg:w-full lg:max-w-full xl:max-h-122.5"
          pictureClassName="
            col-start-1 row-start-2
            flex min-h-0 w-full min-w-0 items-center justify-center
            lg:col-start-2 lg:row-span-2 lg:row-start-1
            lg:h-full lg:w-full
          "
          sources={{
            default: {
              src: '/hero/hero-mobile.png',
              width: 1086,
              height: 1448,
              sizes: '80vw',
            },
            variants: [
              {
                media: `(min-width: ${BREAKPOINTS.lg}px)`,
                src: '/hero/hero-desktop.png',
                width: 1448,
                height: 1086,
                sizes: '(min-width: 1280px) 600px, 50vw',
              },
            ],
          }}
        />

        <HeroActions
          newTicketLabel={t('actions.newTicket')}
          contactUsLabel={t('actions.contactUs')}
        />
      </div>
    </section>
  );
};

export default Management;
