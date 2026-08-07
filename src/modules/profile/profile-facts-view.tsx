import { Button } from '@heroui/react';
import { Edit3 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { formatPersianDateTime } from '@/utils';
import ProfileFact from './profile-fact';
import type { IUser } from '@/models';

interface ProfileFactsViewProps {
  user: IUser;
  isOnline: boolean;
  onEditClick: () => void;
}

const USER_ROLE_TRANSLATION_KEYS = {
  USER: 'roles.USER',
  SUPPORT: 'roles.SUPPORT',
  ADMIN: 'roles.ADMIN',
} as const satisfies Record<IUser['role'], string>;

const formatProfileDateTime = (value: string | null) => {
  if (!value) {
    return null;
  }

  return formatPersianDateTime(value);
};

const ProfileFactsView = ({
  user,
  isOnline,
  onEditClick,
}: ProfileFactsViewProps) => {
  const t = useTranslations('profile.editor');

  const createdAtLabel = formatProfileDateTime(user.createdAt);
  const lastLoginAtLabel = formatProfileDateTime(user.lastLoginAt);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:grid-cols-3">
        <ProfileFact label={t('fields.name.label')} value={user.name} />
        <ProfileFact label={t('fields.username.label')} value={user.username} />
        <ProfileFact
          label={t('facts.role')}
          value={t(USER_ROLE_TRANSLATION_KEYS[user.role])}
        />

        {createdAtLabel ? (
          <ProfileFact label={t('facts.createdAt')} value={createdAtLabel} />
        ) : null}

        {lastLoginAtLabel ? (
          <ProfileFact
            label={t('facts.lastLoginAt')}
            value={lastLoginAtLabel}
          />
        ) : null}
      </div>

      <div className="border-separator flex border-t pt-4">
        <Button
          type="button"
          size="md"
          variant="outline"
          isDisabled={!isOnline}
          className="ms-auto"
          onPress={onEditClick}
        >
          <Edit3 aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
          {t('actions.edit')}
        </Button>
      </div>
    </div>
  );
};

export default ProfileFactsView;
