import Button from '@/components/ui/button';
import Card from '@/components/ui/cards/card';
import FileInput from '@/components/ui/forms/file-input';
import Input from '@/components/ui/forms/input';
import TextArea from '@/components/ui/forms/text-area';
import { useTranslation } from 'next-i18next';
import _pick from 'lodash/pick';
import { Form } from '@/components/ui/forms/form';
import { useUpdateUser } from '@/framework/user';
import type { AttachmentsPayload, UpdateUserInput, User } from '@/types';
import { useAttachments } from '@/framework/attachments';
import _get from 'lodash/get';
import { UpdateProfileDto } from 'shop-shared/dist/users';
import _toString from 'lodash/toString';

const ProfileForm = ({ user }: { user: User }) => {
  const { t } = useTranslation('common');
  const { mutate: updateProfile, isLoading } = useUpdateUser();
  const { mutate: uploadAttachments } = useAttachments();

  const handleUpload = (payload: AttachmentsPayload) => {
    uploadAttachments(payload);
  };

  function onSubmit(values: UpdateUserInput) {
    if (!user) {
      return false;
    }
    const avatarAttachment = _get(values, 'profile.avatar[0]');
    if (avatarAttachment) {
      const avatarPayload: AttachmentsPayload = {
        field: 'user.avatar',
        attachment: avatarAttachment,
      };
      handleUpload(avatarPayload);
    }

    const payload: UpdateProfileDto = {
      username: _toString(values.username),
      bio: values.profile?.bio,
      contact: values.email,
    };
    updateProfile(payload);
  }

  return (
    <Form<UpdateUserInput>
      onSubmit={onSubmit}
      useFormProps={{
        ...(user && {
          defaultValues: _pick(user, ['username', 'profile.bio']),
        }),
      }}
    >
      {({ register, control }) => (
        <>
          <div className="mb-8 flex">
            <Card className="w-full">
              <div className="mb-8">
                <FileInput control={control} name="profile.avatar" />
              </div>

              <div className="mb-6 flex flex-row">
                <Input
                  className="flex-1"
                  label={t('text-user-name')}
                  {...register('username')}
                  variant="outline"
                />
              </div>

              <TextArea
                label={t('text-bio')}
                //@ts-ignore
                {...register('profile.bio')}
                variant="outline"
                className="mb-6"
              />

              <div className="flex">
                <Button
                  className="ltr:ml-auto rtl:mr-auto"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {t('text-save')}
                </Button>
              </div>
            </Card>
          </div>
        </>
      )}
    </Form>
  );
};

export default ProfileForm;
