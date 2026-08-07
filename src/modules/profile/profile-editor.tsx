import { Card } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  clientAuthServices,
  type UpdateProfileRequest,
} from '@/apis/services/auth/client';
import { OnlineOnlyNotice } from '@/components/shared';
import { usePostRequest, usePwa } from '@/hooks';
import ProfileAvatarBanner from './profile-avatar-banner';
import ProfileFactsView from './profile-facts-view';
import ProfileForm from './profile-form';
import {
  createProfileInformationSchema,
  type ProfileInformationFormValues,
} from './profile.schema';
import type { IUser } from '@/models';

interface ProfileEditorProps {
  user: IUser;
  onProfileRefresh: () => Promise<IUser>;
}

const ProfileEditor = ({ user, onProfileRefresh }: ProfileEditorProps) => {
  const t = useTranslations('profile.editor');
  const tValidation = useTranslations('profile.validation');
  const tPwa = useTranslations('pwa.onlineOnly');
  const { isOnline } = usePwa();

  const [isEditing, setIsEditing] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const schema = createProfileInformationSchema({
    nameRequired: tValidation('name.required'),
    nameMinLength: tValidation('name.minLength'),
    usernameRequired: tValidation('username.required'),
    usernameMinLength: tValidation('username.minLength'),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    control,
  } = useForm<ProfileInformationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      username: user.username,
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    reset({
      name: user.name,
      username: user.username,
    });
  }, [user.name, user.username, reset]);

  const { mutateAsync: updateProfile, isPending } = usePostRequest<
    ProfileInformationFormValues,
    IUser
  >({
    requestFn: async (values) => {
      const payload: UpdateProfileRequest = {};
      const nextName = values.name.trim();
      const nextUsername = values.username.trim();

      if (nextName !== user.name) {
        payload.name = nextName;
      }

      if (nextUsername !== user.username) {
        payload.username = nextUsername;
      }

      return clientAuthServices.updateProfile(payload);
    },
    getSuccessDescription: () => t('toast.success'),
    onSuccess: async (updatedUser) => {
      reset({
        name: updatedUser.name,
        username: updatedUser.username,
      });
      setIsEditing(false);
      await onProfileRefresh();
    },
  });

  const handleCancelEdit = () => {
    reset({
      name: user.name,
      username: user.username,
    });
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    reset({
      name: user.name,
      username: user.username,
    });
    setIsEditing(true);
  };

  const onSubmit = async (data: ProfileInformationFormValues) => {
    if (!isDirty || !isOnline) {
      return;
    }

    await updateProfile(data);
  };

  return (
    <Card className="border-border bg-surface overflow-hidden rounded-xl border shadow-sm">
      <Card.Content>
        <div className="space-y-5">
          <ProfileAvatarBanner
            user={user}
            isOnline={isOnline}
            isPending={isPending}
            onProfileRefresh={onProfileRefresh}
            onFileErrorChange={setFileError}
          />

          {fileError ? (
            <p className="text-caption text-danger-600">{fileError}</p>
          ) : null}

          {!isOnline ? (
            <OnlineOnlyNotice>{tPwa('profile')}</OnlineOnlyNotice>
          ) : null}

          {isEditing ? (
            <ProfileForm
              control={control}
              errors={errors}
              isDirty={isDirty}
              isPending={isPending}
              isOnline={isOnline}
              onSubmit={handleSubmit(onSubmit)}
              onCancel={handleCancelEdit}
            />
          ) : (
            <ProfileFactsView
              user={user}
              isOnline={isOnline}
              onEditClick={handleStartEdit}
            />
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

export default ProfileEditor;
