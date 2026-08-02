import {
  Button,
  Card,
  FieldError,
  Input,
  Label,
  TextField,
} from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Save, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import {
  clientAuthServices,
  type UpdateProfileRequest,
} from '@/apis/services/auth/client';
import { clientFileServices } from '@/apis/services/files/client';
import {
  ICON_SIZE_CLASS,
  PROFILE_IMAGE_ACCEPT,
  PROFILE_IMAGE_ALLOWED_EXTENSIONS,
  PROFILE_IMAGE_MAX_SIZE,
} from '@/constants';
import { usePostRequest } from '@/hooks';
import {
  formatFileSize,
  formatPersianDateTime,
  getFileExtension,
  isAllowedFileExtension,
} from '@/utils';
import {
  createProfileInformationSchema,
  type ProfileInformationFormValues,
} from './profile.schema';
import type { IUser } from '@/models';

interface ProfileEditorProps {
  user: IUser;
  onProfileRefresh: () => Promise<IUser>;
}

interface SelectedProfileImage {
  file: File;
  previewSrc: string;
}

const USER_ROLE_TRANSLATION_KEYS = {
  USER: 'roles.USER',
  SUPPORT: 'roles.SUPPORT',
  ADMIN: 'roles.ADMIN',
} as const satisfies Record<IUser['role'], string>;

const getUserInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return '';
  }

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('');
};

const formatProfileDateTime = (value: string | null) => {
  if (!value) {
    return null;
  }

  return formatPersianDateTime(value);
};

const ProfileEditor = ({ user, onProfileRefresh }: ProfileEditorProps) => {
  const t = useTranslations('profile.editor');
  const tValidation = useTranslations('profile.validation');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] =
    useState<SelectedProfileImage | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const initials = getUserInitials(user.name);
  const displayImageSrc = selectedImage?.previewSrc ?? user.profileImageUrl;
  const createdAtLabel = formatProfileDateTime(user.createdAt);
  const lastLoginAtLabel = formatProfileDateTime(user.lastLoginAt);

  const schema = createProfileInformationSchema({
    nameRequired: tValidation('name.required'),
    nameMinLength: tValidation('name.minLength'),
    usernameRequired: tValidation('username.required'),
    usernameMinLength: tValidation('username.minLength'),
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileInformationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      username: user.username,
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const hasChanges = isDirty || Boolean(selectedImage);

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

      if (selectedImage) {
        const uploadedFile = await clientFileServices.uploadFile(
          selectedImage.file,
        );
        payload.profileImageFileId = uploadedFile.id;
      }

      return clientAuthServices.updateProfile(payload);
    },
    getSuccessDescription: () => t('toast.success'),
    onSuccess: async (updatedUser) => {
      setSelectedImage(null);
      setFileError(null);
      reset({
        name: updatedUser.name,
        username: updatedUser.username,
      });
      await onProfileRefresh();
    },
  });

  useEffect(() => {
    const currentPreviewSrc = selectedImage?.previewSrc;

    return () => {
      if (currentPreviewSrc) {
        URL.revokeObjectURL(currentPreviewSrc);
      }
    };
  }, [selectedImage?.previewSrc]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';

    if (!file) {
      return;
    }

    const extension = getFileExtension(file);

    if (!isAllowedFileExtension(extension, PROFILE_IMAGE_ALLOWED_EXTENSIONS)) {
      setSelectedImage(null);
      setFileError(t('image.errors.invalidType'));
      return;
    }

    if (file.size > PROFILE_IMAGE_MAX_SIZE) {
      setSelectedImage(null);
      setFileError(
        t('image.errors.maxSize', {
          size: formatFileSize(PROFILE_IMAGE_MAX_SIZE),
        }),
      );
      return;
    }

    setSelectedImage({
      file,
      previewSrc: URL.createObjectURL(file),
    });
    setFileError(null);
  };

  const handleClearSelectedImage = () => {
    setSelectedImage(null);
    setFileError(null);
  };

  const onSubmit = async (data: ProfileInformationFormValues) => {
    if (!hasChanges) {
      return;
    }

    await updateProfile(data);
  };

  return (
    <Card className="border-border bg-surface overflow-hidden rounded-xl border shadow-sm">
      <Card.Content className="p-4 pt-5 lg:p-6 lg:pt-5">
        <form
          aria-label={t('ariaLabel')}
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="bg-primary-50 border-border rounded-xl border p-4 md:p-5">
            <input
              ref={fileInputRef}
              type="file"
              accept={PROFILE_IMAGE_ACCEPT}
              className="sr-only"
              onChange={handleFileChange}
            />

            <div className="grid min-w-0 grid-cols-1 items-center gap-4 text-center md:grid-cols-[7rem_minmax(0,1fr)] md:gap-5 md:text-start">
              <div className="bg-surface border-border mx-auto flex size-28 max-w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border shadow-sm md:mx-0">
                {displayImageSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayImageSrc}
                    alt={t('image.avatarAlt', { name: user.name })}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="text-h3 text-accent">{initials}</span>
                )}
              </div>

              <div className="flex min-w-0 flex-col gap-3">
                <div className="min-w-0">
                  <p className="text-title text-foreground truncate">
                    {user.name}
                  </p>
                  <p
                    className="text-body-sm text-muted font-latin mt-1 truncate"
                    dir="ltr"
                  >
                    {user.username}
                  </p>
                  <p className="text-caption text-muted mt-2">
                    {t('image.hint', {
                      size: formatFileSize(PROFILE_IMAGE_MAX_SIZE),
                    })}
                  </p>

                  {selectedImage ? (
                    <p className="text-caption text-foreground mt-2 truncate">
                      {t('image.selected', { name: selectedImage.file.name })}
                    </p>
                  ) : null}
                </div>

                <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-2 sm:flex sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    fullWidth
                    className="sm:w-auto"
                    onPress={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus
                      aria-hidden="true"
                      className={ICON_SIZE_CLASS.sm}
                    />
                    {t('image.action')}
                  </Button>

                  {selectedImage ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="md"
                      aria-label={t('image.clear')}
                      className="size-10 min-w-10 shrink-0 p-0"
                      onPress={handleClearSelectedImage}
                    >
                      <X aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {fileError ? (
            <p className="text-caption text-danger-600">{fileError}</p>
          ) : null}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <TextField fullWidth isInvalid={Boolean(errors.name)}>
              <Label>{t('fields.name.label')}</Label>
              <Input
                {...register('name')}
                autoComplete="name"
                placeholder={t('fields.name.placeholder')}
              />
              <FieldError>{errors.name?.message}</FieldError>
            </TextField>

            <TextField fullWidth isInvalid={Boolean(errors.username)}>
              <Label>{t('fields.username.label')}</Label>
              <Input
                {...register('username')}
                autoComplete="username"
                placeholder={t('fields.username.placeholder')}
              />
              <FieldError>{errors.username?.message}</FieldError>
            </TextField>
          </div>

          <div className="border-separator grid grid-cols-1 gap-3 border-t pt-4 sm:grid-cols-2">
            <ProfileFact
              label={t('facts.role')}
              value={t(USER_ROLE_TRANSLATION_KEYS[user.role])}
            />

            {createdAtLabel ? (
              <ProfileFact
                label={t('facts.createdAt')}
                value={createdAtLabel}
              />
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
              fullWidth
              type="submit"
              size="md"
              variant="primary"
              className="lg:ms-auto lg:w-auto"
              isDisabled={!hasChanges || isPending}
              isPending={isPending}
            >
              <Save aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
              {t('actions.submit')}
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
};

interface ProfileFactProps {
  label: string;
  value: string;
}

const ProfileFact = ({ label, value }: ProfileFactProps) => (
  <div className="bg-surface border-border min-w-0 rounded-lg border px-3 py-2">
    <p className="text-caption text-muted">{label}</p>
    <p className="text-body-sm text-foreground mt-1 truncate font-medium">
      {value}
    </p>
  </div>
);

export default ProfileEditor;
