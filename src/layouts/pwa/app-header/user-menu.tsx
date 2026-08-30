'use client';

import { Avatar, Button, Dropdown, Label, Separator } from '@heroui/react';
import { ChevronDown, LogOut, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS, ROUTES } from '@/constants';
import { useAuth } from '@/hooks';
import { cn, getUserInitials } from '@/utils';
import type { Key } from 'react';

const UserMenu = () => {
  const t = useTranslations('pwaLayout.appHeader');
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
        <Avatar size="sm" color="accent" variant="soft">
          {user?.profileImageUrl ? (
            <Avatar.Image src={user.profileImageUrl} alt={userName} />
          ) : null}

          <Avatar.Fallback>{userInitials}</Avatar.Fallback>
        </Avatar>

        <span className="text-body-sm text-foreground hidden max-w-40 truncate font-medium lg:block">
          {userName}
        </span>

        <ChevronDown
          className={cn(
            'text-muted hidden shrink-0 lg:block',
            ICON_SIZE_CLASS.sm,
          )}
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
            <UserRound className={ICON_SIZE_CLASS.md} />
            <Label>{t('profile')}</Label>
          </Dropdown.Item>

          <Separator />

          <Dropdown.Item
            id="logout"
            textValue={t('logout')}
            variant="danger"
            isDisabled={isLoggingOut}
          >
            <LogOut className={ICON_SIZE_CLASS.md} />
            <Label>{t('logout')}</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};

export default UserMenu;
