/**
 * Formats the prisma error target to use as a message for an error response
 * @example
 * // returns "User username"
 * formatPrismaErrorTarget("user_username_key")
 * @param {string} word The err.meta.target string from PrismaClientKnownError
 * @returns {string} Returns the formatted string
 */
export const formatPrismaErrorTarget = (word: string) => {
  const str = word.split('_').slice(0, -1).join(' ')
  return str.charAt(0).toUpperCase() + str.slice(1)
}
