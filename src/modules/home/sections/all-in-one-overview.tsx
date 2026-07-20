import DImage from '@/components/shared/image';
import { BREAKPOINTS } from '@/constants';
import {
  CircleCheckBig,
  LayoutDashboardIcon,
  MessageSquareTextIcon,
  UsersRoundIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

const features = [
  {
    key: 'ticketOverview',
    icon: LayoutDashboardIcon,
  },
  {
    key: 'userManagement',
    icon: UsersRoundIcon,
  },
  {
    key: 'smartPrioritization',
    icon: MessageSquareTextIcon,
  },
] as const;

const AllInOneOverview = () => {
  const t = useTranslations('home.allInOneOverview');

  return (
    <section aria-labelledby="all-in-one-title" className="w-full bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between lg:gap-10 xl:gap-16">
          <div className="flex w-full flex-col items-center gap-5 text-center lg:w-1/2 lg:min-w-0 lg:items-start lg:text-right">
            <div className="flex max-w-xl flex-col gap-2">
              <h2 id="all-in-one-title" className="text-h2 text-neutral-900">
                {t('title')}
              </h2>

              <p className="text-body-sm xl:text-body leading-7 text-neutral-500">
                {t('description')}
              </p>
            </div>

            <div className="flex w-full max-w-lg flex-col gap-2">
              {features.map(({ key, icon: Icon }) => (
                <div
                  key={key}
                  className="group ease-standard hover:bg-primary-50 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-250"
                >
                  <CircleCheckBig
                    size={20}
                    className="text-primary-500 shrink-0"
                  />

                  <span className="text-body-sm xl:text-body flex-1 text-right text-neutral-700">
                    {t(`features.${key}`)}
                  </span>

                  <div className="bg-primary-50 text-primary-500 group-hover:bg-primary-100 flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-250">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DImage
            alt={t('imageAlt')}
            className="h-auto w-[70%] max-w-80 object-contain sm:max-w-96 lg:max-h-130 lg:w-full lg:max-w-full"
            pictureClassName="flex w-full min-w-0 items-center justify-center lg:w-1/2"
            sources={{
              default: {
                src: '/hero/hero-mobile.png',
                width: 1086,
                height: 1448,
                sizes: '70vw',
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
        </div>
      </div>
    </section>
  );
};

export default AllInOneOverview;
