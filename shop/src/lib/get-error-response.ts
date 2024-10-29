import _get from 'lodash/get';

export const getErrorResponse = (error: unknown) => {
  const responseData = _get(error, 'response.data', {});
  const message =
    _get(responseData, 'error.message', '') ||
    _get(responseData, 'message', '');
  return {
    statusCode: _get(error, 'statusCode'),
    status: _get(responseData, 'statusCode', 400),
    message,
  };
};
