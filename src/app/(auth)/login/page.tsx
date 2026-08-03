import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants';

const Page = () => {
  redirect(ROUTES.login);
};

export default Page;
