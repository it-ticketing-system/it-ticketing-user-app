import { getTranslations } from 'next-intl/server';
import StatsStripAnimated from './stats-strip-animated';

const StatsStrip = async () => {
  const t = await getTranslations('home.statsStrip');

  return (
    <StatsStripAnimated
      ariaLabel={t('ariaLabel')}
      labels={{
        answeredTickets: t('items.answeredTickets'),
        userSatisfaction: t('items.userSatisfaction'),
        activeUsers: t('items.activeUsers'),
        onlineSupport: t('items.onlineSupport'),
      }}
    />
  );
};

export default StatsStrip;
