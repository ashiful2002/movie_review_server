class AppError extends Error {
  public statusCode: number;

  constructor(statsCode: number, message: string, stack = "") {
    super(message);
    this.statusCode = statsCode;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
