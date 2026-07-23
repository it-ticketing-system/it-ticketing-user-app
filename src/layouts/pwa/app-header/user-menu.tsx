'use client';

import { Avatar, Button, Dropdown, Label, Separator } from '@heroui/react';
import { ChevronDown, LogOut, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/constants';
import useAuth from '@/hooks/use-auth';
import type { Key } from 'react';

const getUserInitials = (name: string) => {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return '';
  }

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('');
};

const UserMenu = () => {
  const t = useTranslations('pwa_layout.appHeader');
  const router = useRouter();
  const { user, isLoggingOut, logout } = useAuth();

  const userName = user?.name || t('user');
  const userInitials = getUserInitials(userName);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleMenuAction = (key: Key) => {
    if (key === 'profile') {
      router.push(ROUTES.profile);
      return;
    }

    if (key === 'logout') {
      void handleLogout();
    }
  };

  return (
    <Dropdown>
      <Button
        variant="ghost"
        aria-label={t('openProfileMenu')}
        className="h-11 min-w-0 gap-2 rounded-lg px-1 lg:px-2"
      >
        <Avatar
          size="md"
          color="accent"
          variant="soft"
          className="size-8 shrink-0"
        >
          {user?.profileImageUrl ? (
            <Avatar.Image src={user.profileImageUrl} alt={userName} />
          ) : null}

          <Avatar.Fallback className="text-body-sm font-semibold">
            {userInitials}
          </Avatar.Fallback>
        </Avatar>

        <span className="text-body-sm text-foreground hidden max-w-40 truncate font-medium lg:block">
          {t('greeting', {
            name: userName,
          })}
        </span>

        <ChevronDown
          className="text-muted hidden size-4 shrink-0 lg:block"
          strokeWidth={2}
        />
      </Button>

      <Dropdown.Popover
        placement="bottom left"
        className="border-border bg-overlay min-w-56 rounded-lg border p-2 shadow-lg"
      >
        <Dropdown.Menu
          aria-label={t('profileMenu')}
          onAction={handleMenuAction}
          dir="rtl"
        >
          <Dropdown.Item id="profile" textValue={t('profile')}>
            <UserRound className="size-5" strokeWidth={2} />
            <Label>{t('profile')}</Label>
          </Dropdown.Item>

          <Separator />

          <Dropdown.Item
            id="logout"
            textValue={t('logout')}
            variant="danger"
            isDisabled={isLoggingOut}
          >
            <LogOut className="size-5" strokeWidth={2} />
            <Label>{t('logout')}</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};

export default UserMenu;
