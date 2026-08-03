import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants';

const Page = () => {
  redirect(ROUTES.register);
};

export default Page;
