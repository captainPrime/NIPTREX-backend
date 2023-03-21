export enum ResponseCodeEnums {
  // Authentication Response (PREFIX : 1??? | Last Index)
  AUTHORIZED_SUCCESSFUL = 1000,
  UNAUTHORIZED_TOKEN = 1001,
  USER_REGISTER_SUCCESSFUL = 1002,
  LOGIN_VALIDATION_ERROR = 1003,
  INVALID_LOGIN_CREDENTIALS = 1004,
  REGISTER_VALIDATION_ERROR = 1005,
  DUPLICATE_TOKEN_ERROR = 1006,
  INVALID_ACTIVATION_TOKEN = 1008,
  USER_PROFILE_NOT_ACTIVATED = 1009,
  USER_ACCOUNT_ACTIVATION_VALIDATION_ERROR = 1010,
  ACCOUNT_REQUEST_ACTIVATION_VALIDATION_ERROR = 1011,
  INVALID_AUTHORIZATION = 1012,
  USER_ACCOUNT_NOT_CONNECTED = 1013,
  CREATE_PROFILE_BIG_QUERY_REQUEST_ERROR = 1014,
  INVALID_USER_PERMISSION = 1015,
}

interface ResponseMessage {
  status: number;
  response_code: ResponseCodeEnums;
  message: string;
}

export function responseMessage(code: ResponseCodeEnums): ResponseMessage {
  switch (code) {
    /*
    |--------------------------------------------------------------------------
    | Auth Response
    |--------------------------------------------------------------------------
    */
    case ResponseCodeEnums.LOGIN_VALIDATION_ERROR:
      return {
        status: 400,
        response_code: code,
        message: ResponseCodeEnums[code],
      };
    case ResponseCodeEnums.INVALID_LOGIN_CREDENTIALS:
      return {
        status: 400,
        response_code: code,
        message: ResponseCodeEnums[code],
      };
    case ResponseCodeEnums.USER_REGISTER_SUCCESSFUL:
      return {
        status: 200,
        response_code: code,
        message: ResponseCodeEnums[code],
      };
    default:
      throw new Error(`Invalid response code: ${code}`);
  }
}
