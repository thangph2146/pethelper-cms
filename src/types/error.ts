export class ValidationError extends Error {
  status: number;
  field?: string;

  constructor(message: string, status = 400, field?: string) {
    super(message);
    this.name = 'ValidationError';
    this.status = status;
    this.field = field;
  }
}

export class AuthenticationError extends Error {
  status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.name = 'AuthenticationError';
    this.status = status;
  }
}

export class AuthorizationError extends Error {
  status: number;

  constructor(message: string, status = 403) {
    super(message);
    this.name = 'AuthorizationError';
    this.status = status;
  }
} 