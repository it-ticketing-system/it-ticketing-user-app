import axios from 'axios';
import type {
  ApiErrorPayload,
  ApiErrorResponse,
  ApiFieldErrors,
} from '@/apis/core/types/api-response';

export type ApiErrorMessageKey =
  | 'errors.generic'
  | 'errors.network'
  | 'errors.unauthorized'
  | 'errors.forbidden'
  | 'errors.server'
  | 'errors.validation'
  | 'errors.invalidCredentials'
  | 'errors.usernameAlreadyExists'
  | 'errors.currentPasswordIncorrect'
  | 'errors.passwordConfirmationMismatch'
  | 'errors.tokenInvalidated'
  | 'errors.invalidFileType'
  | 'errors.departmentNotFound'
  | 'errors.ticketNotFound'
  | 'errors.ticketClosed'
  | 'errors.actionNotAllowed'
  | 'errors.invalidStatusTransition'
  | 'errors.supportNotInDepartment'
  | 'errors.departmentNameAlreadyExists';

export type ApiRequestError = {
  code: string;
  messageKey: ApiErrorMessageKey;
};

const API_ERROR_MESSAGE_KEYS = {
  VALIDATION_ERROR: 'errors.validation',
  INVALID_CREDENTIALS: 'errors.invalidCredentials',
  USERNAME_ALREADY_EXISTS: 'errors.usernameAlreadyExists',
  CURRENT_PASSWORD_INCORRECT: 'errors.currentPasswordIncorrect',
  PASSWORD_CONFIRMATION_MISMATCH: 'errors.passwordConfirmationMismatch',
  TOKEN_INVALIDATED: 'errors.tokenInvalidated',
  INVALID_FILE_TYPE: 'errors.invalidFileType',
  DEPARTMENT_NOT_FOUND: 'errors.departmentNotFound',
  TICKET_NOT_FOUND: 'errors.ticketNotFound',
  FORBIDDEN: 'errors.forbidden',
  TICKET_CLOSED: 'errors.ticketClosed',
  ACTION_NOT_ALLOWED: 'errors.actionNotAllowed',
  INVALID_STATUS_TRANSITION: 'errors.invalidStatusTransition',
  SUPPORT_NOT_IN_DEPARTMENT: 'errors.supportNotInDepartment',
  DEPARTMENT_NAME_ALREADY_EXISTS: 'errors.departmentNameAlreadyExists',
} as const satisfies Record<string, ApiErrorMessageKey>;

interface ApiExceptionOptions {
  code: string;
  messageKey: ApiErrorMessageKey;
  status?: number;
  fields?: ApiFieldErrors;
  serverMessage?: string;
}

export class ApiException extends Error {
  readonly code: string;
  readonly messageKey: ApiErrorMessageKey;
  readonly status?: number;
  readonly fields?: ApiFieldErrors;
  readonly serverMessage?: string;

  constructor({
    code,
    messageKey,
    status,
    fields,
    serverMessage,
  }: ApiExceptionOptions) {
    super(code);

    this.name = 'ApiException';
    this.code = code;
    this.messageKey = messageKey;
    this.status = status;
    this.fields = fields;
    this.serverMessage = serverMessage;
  }
}

function getMessageKey(code?: string, status?: number): ApiErrorMessageKey {
  if (code && code in API_ERROR_MESSAGE_KEYS) {
    return API_ERROR_MESSAGE_KEYS[code as keyof typeof API_ERROR_MESSAGE_KEYS];
  }

  if (status === 401) {
    return 'errors.unauthorized';
  }

  if (status === 403) {
    return 'errors.forbidden';
  }

  if (status !== undefined && status >= 500) {
    return 'errors.server';
  }

  return 'errors.generic';
}

export function createApiExceptionFromPayload(
  payload: ApiErrorPayload,
  status?: number,
): ApiException {
  return new ApiException({
    code: payload.code,
    status,
    fields: payload.fields,
    serverMessage: payload.message,
    messageKey: getMessageKey(payload.code, status),
  });
}

export function normalizeApiError(error: unknown): ApiException {
  if (error instanceof ApiException) {
    return error;
  }

  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const status = error.response?.status;

    if (!error.response) {
      return new ApiException({
        code: 'NETWORK_ERROR',
        messageKey: 'errors.network',
      });
    }

    const responseData = error.response.data;

    if (responseData && responseData.success === false) {
      return createApiExceptionFromPayload(responseData.error, status);
    }

    return new ApiException({
      code: `HTTP_${status ?? 'UNKNOWN'}`,
      status,
      messageKey: getMessageKey(undefined, status),
    });
  }

  return new ApiException({
    code: 'UNKNOWN_ERROR',
    messageKey: 'errors.generic',
  });
}

export function toApiRequestError(error: unknown): ApiRequestError {
  const apiError = normalizeApiError(error);

  return {
    code: apiError.code,
    messageKey: apiError.messageKey,
  };
}
