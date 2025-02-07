export interface SuccessResponse<T> {
    success: true;
    status: number;
    message: string;
    data?: T;
  }
  
  export interface ErrorResponse {
    success: false;
    status: number;
    error: string;
    details?: unknown;
  }
  