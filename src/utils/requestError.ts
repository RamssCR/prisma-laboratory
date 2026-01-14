type ErrorProps = {
  status?: number;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'UNKNOWN';
  cause?: Record<string, unknown>;
};

/**
 * Representa un error de forma mas estrcuturada
 * Extiene la clase nativa de error JavaScript para incluir detalles adicionales como el codigo de error,
 * el metodo de peticion y detaller adcionales sobre la causa
 * @example
 * const error = new RequestError('Not found', 404, 'GET', { resource : user });
 * console.log(error.toString());
 */
export class RequestError extends Error {
  public status: number;
  public method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'UNKNOWN';
  public cause: Record<string, unknown>;

  constructor(
    message: string,
    { status = 500, method = 'UNKNOWN' as const, cause = {} }: ErrorProps,
  ) {
    super(message);
    this.name = 'RequestError';
    this.status = status;
    this.method = method;
    this.cause = cause;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequestError);
    }
  }

  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      method: this.method,
      cause: this.cause,
    };
  }

  public toString(): string {
    return `${this.name} [${this.method}] (status: ${this.status}): ${this.message} - Details: ${JSON.stringify(this.cause)}`;
  }
}
