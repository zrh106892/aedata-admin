export * from './agent';
export * from './core';
export * from './notification';
export * from './order';
export * from './platform-user';
export * from './product-manage';
export * from './promotion';
export * from './system';
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

export interface PageResult<T> {
  items: T[];
  total: number;
}

declare global {
  interface Window {
    $http: {
      delete<T = any>(url: string, config?: any): Promise<ApiResponse<T>>;
      get<T = any>(url: string, config?: any): Promise<ApiResponse<T>>;
      post<T = any>(
        url: string,
        data?: any,
        config?: any,
      ): Promise<ApiResponse<T>>;
      put<T = any>(
        url: string,
        data?: any,
        config?: any,
      ): Promise<ApiResponse<T>>;
    };
  }
}
