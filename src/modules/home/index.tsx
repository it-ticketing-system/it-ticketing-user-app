import AllInOneOverview from './sections/all-in-one-overview';
import ContactUs from './sections/contact-us';
import Management from './sections/managment';
import StatsStrip from './sections/stats-strip';
import WhyTicketingSystem from './sections/why-ticketing-system';

const HomeModule = () => {
  return (
    <div className="flex flex-col gap-6">
      <Management />
      <WhyTicketingSystem />
      <StatsStrip />
      <AllInOneOverview />
      <ContactUs />
    </div>
  );
};

export default HomeModule;
