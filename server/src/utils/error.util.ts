export class InvalidDataError extends Error {
  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, InvalidDataError.prototype)
  }
}
