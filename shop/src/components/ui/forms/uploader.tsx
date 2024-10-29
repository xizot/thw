import { useEffect, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'next-i18next';
import { UploadIcon } from '@/components/icons/upload-icon';
import { toBase64 } from '@/lib/base64';

export default function Uploader({
  onChange,
  value,
  name,
  onBlur,
  multiple = false,
}: any) {
  const { t } = useTranslation('common');

  const [imageReviews, setImageReviews] = useState<string[]>([]);

  const handleImagePreview = (acceptedFiles: File[]) => {
    const result = acceptedFiles.map(async (file) => {
      const base64 = await toBase64(file);
      return base64;
    });
    return Promise.all(result);
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const images = await handleImagePreview(acceptedFiles);
      setImageReviews(images);
      onChange(acceptedFiles);
    },
    [handleImagePreview]
  );

  const { getRootProps, getInputProps } = useDropzone({
    //@ts-ignore
    accept: 'image/*',
    multiple,
    onDrop,
  });
  //FIXME: package update need to check
  // types: [
  //   {
  //     description: 'Images',
  //     accept: {
  //       'image/*': ['.png', '.gif', '.jpeg', '.jpg']
  //     }
  //   },
  // ],
  // excludeAcceptAllOption: true,
  // multiple: false
  const thumbs = imageReviews.map((src, idx) => (
    <div
      className="relative mt-2 inline-flex flex-col overflow-hidden rounded border border-border-100 ltr:mr-2 rtl:ml-2"
      key={idx}
    >
      <div className="h-40 w-full min-w-0 overflow-hidden">
        {/* eslint-disable */}
        <img
          src={src}
          alt="avatar"
          className="inline-block h-full w-full object-cover"
        />
      </div>
    </div>
  ));
  //FIXME: maybe no need to use this
  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      imageReviews.forEach((file) => URL.revokeObjectURL(file));
    },
    [imageReviews]
  );

  return (
    <section className="upload">
      <div
        {...getRootProps({
          className:
            'border-dashed border-2 border-border-base h-36 rounded flex flex-col justify-center items-center cursor-pointer focus:border-accent-400 focus:outline-none',
        })}
      >
        <input
          {...getInputProps({
            name,
            onBlur,
          })}
        />
        <UploadIcon className="text-muted-light" />
        <p className="mt-4 text-center text-sm text-body">
          <span className="font-semibold text-accent">
            {t('text-upload-highlight')}
          </span>{' '}
          {t('text-upload-message')} <br />
          <span className="text-xs text-body">{t('text-img-format')}</span>
        </p>
      </div>

      <aside className="mt-2 flex flex-wrap">{!!thumbs.length && thumbs}</aside>
    </section>
  );
}
