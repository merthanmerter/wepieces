export const MESSAGES = {
  required: "required",
  string: "must be a string",
  number: "must be a number",
  min: (min: number) => `must be at least ${min} characters`,
  max: (max: number) => `must be at most ${max} characters`,
  email: "must be a valid email",
  url: "must be a valid url",
  includes: (value: string) => `must include ${value}`,
  startsWith: (value: string) => `must start with ${value}`,
  endsWith: (value: string) => `must end with ${value}`,
  date: "must be a valid date",
  time: "must be a valid time",
  gt: (value: number) => `must be greater than ${value}`,
  lt: (value: number) => `must be less than ${value}`,
  between: (min: number, max: number) => `must be between ${min} and ${max}`,
  gte: (value: number) => `must be greater than or equal to ${value}`,
  lte: (value: number) => `must be less than or equal to ${value}`,
  exists: (name: string) => `${name} already exists`,
  notFound: (name: string) => `${name} not found!`,
  unauthorized: "unauthorized",
  unknownError: "unknown error",
  notUser: "Only users can access this page.",
  notAdmin: "Only admins can access this page.",
} as const;
