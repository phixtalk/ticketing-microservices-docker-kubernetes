import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
    statusCode = 400;

    constructor() {
      super('Route not found error');
      
      Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors() { 
       return [{ message: 'Not found' }];
    }
}