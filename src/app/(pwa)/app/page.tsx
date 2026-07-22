'use client';
import { useAuth } from '@/hooks';

const Page = () => {
  const { user } = useAuth();
  return <div>Hello {user?.name}</div>;
};
export default Page;
