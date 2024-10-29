import _toString from 'lodash/toString';

export const toBase64 = (file: File) =>
  new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(_toString(reader.result));
    reader.onerror = () => resolve('');
  });
