import Image from 'next/image';
import { FC } from 'react';

const Logo: FC = () => {
  return (
    <Image
      src="/logo/logo-mark-primary-512.png"
      width={40}
      height={40}
      alt="Logo"
      unoptimized
    />
  );
};

export default Logo;
