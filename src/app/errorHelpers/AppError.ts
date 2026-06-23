class AppError extends Error {
  public httpStatusCode: number;

  constructor(statsCode: number, message: string, stack = "") {
    super(message);
    this.httpStatusCode = statsCode;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
