export class ValidationError extends Error {
  code?: number;
  field?: string;

  constructor(message: string, codeOrField?: number | string, field?: string) {
    super(message);
    
    if (typeof codeOrField === 'number') {
      this.code = codeOrField;
      this.field = field;
    } else {
      this.field = codeOrField;
    }
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