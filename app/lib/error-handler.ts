/**
 * Error handling utilities
 */

export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: Error;
  code?: string | number;
}

/**
 * Error'ı AppError'a dönüştürür
 */
export function normalizeError(error: unknown): AppError {
  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return {
        type: ErrorType.NETWORK_ERROR,
        message: 'İnternet bağlantınızı kontrol edin',
        originalError: error,
      };
    }

    // Timeout errors
    if (error.message.includes('timeout') || error.name === 'AbortError') {
      return {
        type: ErrorType.TIMEOUT_ERROR,
        message: 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.',
        originalError: error,
      };
    }

    // API errors
    if (error.message.includes('API') || error.message.includes('status')) {
      return {
        type: ErrorType.API_ERROR,
        message: error.message || 'API hatası oluştu',
        originalError: error,
      };
    }

    return {
      type: ErrorType.UNKNOWN_ERROR,
      message: error.message || 'Bilinmeyen bir hata oluştu',
      originalError: error,
    };
  }

  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: 'Bilinmeyen bir hata oluştu',
  };
}

/**
 * User-friendly error mesajları
 */
export function getErrorMessage(error: AppError): string {
  const messages: Record<ErrorType, string> = {
    [ErrorType.NETWORK_ERROR]: 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.',
    [ErrorType.API_ERROR]: error.message || 'Hava durumu verisi alınamadı. Lütfen daha sonra tekrar deneyin.',
    [ErrorType.TIMEOUT_ERROR]: 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.',
    [ErrorType.PERMISSION_ERROR]: 'Konum izni gerekli. Lütfen tarayıcı ayarlarından izin verin.',
    [ErrorType.UNKNOWN_ERROR]: error.message || 'Bir hata oluştu. Lütfen sayfayı yenileyin.',
  };

  return messages[error.type] || messages[ErrorType.UNKNOWN_ERROR];
}

