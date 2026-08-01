import { Button } from '@heroui/react';
import { PhoneIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DImage } from '@/components/shared';
import { BREAKPOINTS, ICON_SIZE_CLASS } from '@/constants';

const ContactUs = () => {
  const t = useTranslations('home.contactUs');

  return (
    <section
      dir="rtl"
      aria-labelledby="contact-us-title"
      className="w-full bg-white"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8">
        <div className="border-primary-100 bg-primary-50 flex min-h-24 w-full items-center gap-3 overflow-hidden rounded-xl border p-3 sm:gap-4 sm:p-4 lg:min-h-40 lg:gap-8 lg:px-14 lg:py-5 xl:px-28">
          <DImage
            alt={t('imageAlt')}
            className="h-auto w-full object-contain"
            pictureClassName="
              flex
              w-[90px]
              shrink-0
              items-center
              justify-center

              sm:w-[110px]

              lg:w-[170px]

              xl:w-[190px]
            "
            sources={{
              default: {
                src: '/hero/contact-us-mobile.png',
                width: 911,
                height: 665,
                sizes: '30vw',
              },
              variants: [
                {
                  media: `(min-width: ${BREAKPOINTS.lg}px)`,
                  src: '/hero/contact-us-desktop.png',
                  width: 1354,
                  height: 665,
                  sizes: '(min-width: 1280px) 240px, 30vw',
                },
              ],
            }}
          />

          <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="flex min-w-0 flex-col gap-1 text-right lg:gap-1.5">
              <h2
                id="contact-us-title"
                className="text-body-sm sm:text-body lg:text-title font-semibold text-neutral-900"
              >
                {t('title')}
              </h2>

              <p className="text-caption sm:text-body-sm line-clamp-2 text-neutral-500">
                {t('description')}
              </p>
            </div>

            <Button
              fullWidth
              className="border-primary-200 text-primary-500 h-10 shrink-0 bg-white sm:h-11 lg:w-auto lg:min-w-36 lg:px-5"
            >
              <PhoneIcon className={ICON_SIZE_CLASS.md} />
              {t('action')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
