import {
  BarChart3Icon,
  HeadphonesIcon,
  LayoutDashboardIcon,
  ShieldCheckIcon,
  TicketCheckIcon,
  ZapIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import type { LucideIcon } from 'lucide-react';

interface IFeatureCard {
  title: string;
  description: string;
  icon: LucideIcon;
}

const features = [
  {
    key: 'easyTicket',
    icon: TicketCheckIcon,
  },
  {
    key: 'realtimeTracking',
    icon: ZapIcon,
  },
  {
    key: 'fastResponse',
    icon: HeadphonesIcon,
  },
  {
    key: 'analytics',
    icon: BarChart3Icon,
  },
  {
    key: 'security',
    icon: ShieldCheckIcon,
  },
  {
    key: 'integratedManagement',
    icon: LayoutDashboardIcon,
  },
] as const;

const FeatureCard = ({ title, description, icon: Icon }: IFeatureCard) => {
  return (
    <article className="group ease-standard hover:border-primary-200 flex min-h-35 w-full flex-col items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 text-center transition-all duration-250 hover:-translate-y-1 hover:shadow-sm lg:min-h-40 lg:p-5">
      <div className="bg-primary-50 text-primary-500 group-hover:bg-primary-100 flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-250">
        <Icon className={ICON_SIZE_CLASS.md} />
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <h3 className="text-body font-semibold text-neutral-900">{title}</h3>

        <p className="text-caption max-w-45 leading-5 text-neutral-500">
          {description}
        </p>
      </div>
    </article>
  );
};

const WhyTicketingSystem = () => {
  const t = useTranslations('home.whyTicketingSystem');

  return (
    <section aria-labelledby="why-ticketing-title" className="w-full bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8">
        <div className="mx-auto mb-6 flex max-w-2xl flex-col items-center gap-2 text-center lg:mb-8">
          <h2 id="why-ticketing-title" className="text-h2 text-neutral-900">
            {t('title')}
          </h2>

          <p className="text-body-sm text-neutral-500">{t('description')}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-6 xl:gap-6">
          {features.map(({ key, icon }) => (
            <FeatureCard
              key={key}
              title={t(`features.${key}.title`)}
              description={t(`features.${key}.description`)}
              icon={icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyTicketingSystem;
