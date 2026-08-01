import { MailIcon, PhoneIcon } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Logo } from '@/components/shared';
import { ICON_SIZE_CLASS } from '@/constants';

const quickLinks = [
  {
    key: 'home',
    href: '/',
  },
  {
    key: 'contactUs',
    href: '/contact-us',
  },
] as const;

const resourceLinks = [
  {
    key: 'guide',
    href: '/guide',
  },
  {
    key: 'faq',
    href: '/faq',
  },
] as const;

const Footer = () => {
  const t = useTranslations('footer');

  return (
    <footer
      dir="rtl"
      className="mt-8 w-full border-t border-neutral-200 bg-white"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 py-7 md:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-8 lg:py-8 xl:gap-12">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-3">
              <Logo />

              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-body-sm lg:text-body font-semibold text-neutral-900">
                  {t('brand.title')}
                </span>

                <span className="text-caption leading-5 text-neutral-500">
                  {t('brand.description')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-body-sm font-semibold text-neutral-900">
              {t('quickLinks.title')}
            </h3>

            <nav
              aria-label={t('quickLinks.ariaLabel')}
              className="flex flex-col gap-2.5"
            >
              {quickLinks.map(({ key, href }) => (
                <Link
                  key={key}
                  href={href}
                  className="text-caption hover:text-primary-500 w-fit text-neutral-500 transition-colors duration-150"
                >
                  {t(`quickLinks.items.${key}`)}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-body-sm font-semibold text-neutral-900">
              {t('resources.title')}
            </h3>

            <nav
              aria-label={t('resources.ariaLabel')}
              className="flex flex-col gap-2.5"
            >
              {resourceLinks.map(({ key, href }) => (
                <Link
                  key={key}
                  href={href}
                  className="text-caption hover:text-primary-500 w-fit text-neutral-500 transition-colors duration-150"
                >
                  {t(`resources.items.${key}`)}
                </Link>
              ))}
            </nav>
          </div>

          <div className="col-span-2 flex flex-col gap-3 md:col-span-1 lg:col-span-1">
            <h3 className="text-body-sm font-semibold text-neutral-900">
              {t('contact.title')}
            </h3>

            <div className="flex flex-col gap-2.5">
              <a
                href="tel:+982112345678"
                className="text-caption hover:text-primary-500 flex w-fit items-center gap-2 text-neutral-500 transition-colors duration-150"
              >
                <PhoneIcon
                  className={`text-primary-500 ${ICON_SIZE_CLASS.sm} shrink-0`}
                />

                <span dir="ltr">{t('contact.phone')}</span>
              </a>

              <a
                href="mailto:info@ticketing.ir"
                className="text-caption hover:text-primary-500 flex w-fit items-center gap-2 text-neutral-500 transition-colors duration-150"
              >
                <MailIcon
                  className={`text-primary-500 ${ICON_SIZE_CLASS.sm} shrink-0`}
                />

                <span dir="ltr">{t('contact.email')}</span>
              </a>
            </div>
          </div>
        </div>

        <p className="text-caption border-t border-neutral-100 py-4 text-center text-neutral-400">
          {t('copyright')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
