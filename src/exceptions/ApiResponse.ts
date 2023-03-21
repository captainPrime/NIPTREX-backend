class ApiResponse<T> {
  status: number;
  responseCode: any;
  message: string;
  data: T | null;

  constructor(data: T | null = null, responseCode: any) {
    const { status, message } = responseMessage(responseCode);
    this.status = status;
    this.responseCode = responseCode;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
