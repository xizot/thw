import { UploadIcon } from '@/components/icons/upload-icon';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'next-i18next';
import { toBase64 } from '@/lib/base64';

export default function Uploader({
  onChange,
  value,
  multiple,
  acceptFile,
  helperText,
}: any) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const [imageReviews, setImageReviews] = useState<string[]>([]);

  const handleImagePreview = (acceptedFiles: File[]) => {
    const result = acceptedFiles.map(async (file) => {
      const base64 = await toBase64(file);
      return base64;
    });
    return Promise.all(result);
  };

  // ...(!acceptFile ? { accept: 'image/*' } : { accept: ACCEPTED_FILE_TYPES }),
  const { getRootProps, getInputProps } = useDropzone({
    multiple,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length) {
        const images = await handleImagePreview(acceptedFiles);
        setImageReviews(images);
        onChange(acceptedFiles);
      }
    },

    onDropRejected: (fileRejections) => {
      fileRejections.forEach((file) => {
        file?.errors?.forEach((error) => {
          if (error?.code === 'file-too-large') {
            setError(t('error-file-too-large'));
          } else if (error?.code === 'file-invalid-type') {
            setError(t('error-invalid-file-type'));
          }
        });
      });
    },
  });

  const thumbs = imageReviews.map((src, idx) => (
    <div
      className="relative mt-2 inline-flex w-full flex-col overflow-hidden rounded border border-border-100"
      key={idx}
    >
      <div className="h-40 w-full min-w-0 overflow-hidden">
        <img
          src={src}
          alt="avatar"
          className="inline-block h-full w-full object-cover"
        />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      // Reset error after upload new file
      setError(null);
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
        <input {...getInputProps()} />
        <UploadIcon className="text-muted-light" />
        <p className="mt-4 text-center text-sm text-body">
          {helperText ? (
            <span className="font-semibold text-gray-500">{helperText}</span>
          ) : (
            <>
              <span className="font-semibold text-accent">
                {t('text-upload-highlight')}
              </span>{' '}
              {t('text-upload-message')} <br />
              <span className="text-xs text-body">{t('text-img-format')}</span>
            </>
          )}
        </p>
        {error && (
          <p className="mt-4 text-center text-sm text-red-600">{error}</p>
        )}
      </div>

      {!!thumbs.length && (
        <aside className="mt-2 flex flex-wrap">
          {!!thumbs.length && thumbs}
        </aside>
      )}
    </section>
  );
}
