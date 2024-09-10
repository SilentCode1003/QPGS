// A custom error class to throw and catch on handlers

export class InvalidDataError extends Error {
  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, InvalidDataError.prototype)
  }
}
