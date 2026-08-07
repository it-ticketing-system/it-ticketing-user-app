import { toast } from '@heroui/react';
import { ImagePlus, LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useState, type ChangeEvent } from 'react';
import { clientAuthServices } from '@/apis/services/auth/client';
import { clientFileServices } from '@/apis/services/files/client';
import {
  ICON_SIZE_CLASS,
  PROFILE_IMAGE_ACCEPT,
  PROFILE_IMAGE_ALLOWED_EXTENSIONS,
  PROFILE_IMAGE_MAX_SIZE,
} from '@/constants';
import {
  cn,
  formatFileSize,
  getFileExtension,
  getUserInitials,
  isAllowedFileExtension,
} from '@/utils';
import type { IUser } from '@/models';

interface ProfileAvatarBannerProps {
  user: IUser;
  isOnline: boolean;
  isPending: boolean;
  onProfileRefresh: () => Promise<IUser>;
  onFileErrorChange: (error: string | null) => void;
}

const ProfileAvatarBanner = ({
  user,
  isOnline,
  isPending,
  onProfileRefresh,
  onFileErrorChange,
}: ProfileAvatarBannerProps) => {
  const t = useTranslations('profile.editor');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const initials = getUserInitials(user.name);

  const handleAvatarSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';

    if (!file) {
      return;
    }

    const extension = getFileExtension(file);

    if (!isAllowedFileExtension(extension, PROFILE_IMAGE_ALLOWED_EXTENSIONS)) {
      onFileErrorChange(t('image.errors.invalidType'));
      return;
    }

    if (file.size > PROFILE_IMAGE_MAX_SIZE) {
      onFileErrorChange(
        t('image.errors.maxSize', {
          size: formatFileSize(PROFILE_IMAGE_MAX_SIZE),
        }),
      );
      return;
    }

    onFileErrorChange(null);
    setIsUploadingAvatar(true);

    try {
      const uploadedFile = await clientFileServices.uploadFile(file);
      await clientAuthServices.updateProfile({
        profileImageFileId: uploadedFile.id,
      });
      await onProfileRefresh();
      toast.success(t('toast.avatarSuccess'));
    } catch {
      onFileErrorChange(t('image.errors.invalidType'));
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="border-border bg-surface relative overflow-hidden rounded-xl border p-4 shadow-sm lg:p-5">
      <input
        ref={fileInputRef}
        type="file"
        accept={PROFILE_IMAGE_ACCEPT}
        disabled={!isOnline || isUploadingAvatar || isPending}
        className="sr-only"
        onChange={handleAvatarSelect}
      />

      <div
        aria-hidden="true"
        className="bg-primary-50 pointer-events-none absolute -end-12 -top-12 size-40 rounded-full blur-3xl"
      />

      <div className="flex min-w-0 items-center gap-3 lg:gap-4">
        <div className="relative shrink-0">
          <div className="border-border bg-primary-50 relative flex size-20 items-center justify-center overflow-hidden rounded-xl border lg:size-28">
            {user.profileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.profileImageUrl}
                alt={t('image.avatarAlt', { name: user.name })}
                className="size-full object-cover"
              />
            ) : (
              <span className="text-h3 text-accent">{initials}</span>
            )}

            {isUploadingAvatar ? (
              <div className="bg-backdrop absolute inset-0 flex items-center justify-center">
                <LoaderCircle
                  aria-hidden="true"
                  className={cn(ICON_SIZE_CLASS.md, 'animate-spin text-white')}
                />
              </div>
            ) : null}
          </div>

          <button
            type="button"
            aria-label={t('image.action')}
            disabled={!isOnline || isUploadingAvatar || isPending}
            onClick={() => fileInputRef.current?.click()}
            className="border-border bg-surface text-accent hover:bg-primary-50 absolute -start-1 -bottom-1 flex size-8 items-center justify-center rounded-full border shadow-md transition active:scale-95 disabled:pointer-events-none disabled:opacity-40 lg:size-9"
          >
            <ImagePlus aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="min-w-0 flex-1 text-start">
          <p className="text-title text-foreground truncate">{user.name}</p>

          <p
            dir="ltr"
            className="text-body-sm text-muted font-latin mt-1 truncate text-right"
          >
            {user.username}
          </p>

          <p className="text-caption text-muted mt-2">
            {t('image.hint', {
              size: formatFileSize(PROFILE_IMAGE_MAX_SIZE),
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileAvatarBanner;
