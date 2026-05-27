export type Result<TSuccess, TError> =
  | { success: true; data: TSuccess }
  | { success: false; error: TError };

export const success = <TSuccess, TError>(
  data: TSuccess,
): Result<TSuccess, TError> => {
  return { success: true, data };
};

export const failure = <TSuccess, TError>(
  error: TError,
): Result<TSuccess, TError> => {
  return { success: false, error };
};

export const match = <TSuccess, TError>(
  result: Result<TSuccess, TError>,
  onSuccess: (data: TSuccess) => void,
  onFailure: (error: TError) => void,
) => {
  if (result.success) {
    onSuccess(result.data);
  } else {
    onFailure(result.error);
  }
};
