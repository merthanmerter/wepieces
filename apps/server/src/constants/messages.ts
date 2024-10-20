export const MESSAGES = {
  success: "Success",
  required: "required",
  string: "Must be a string",
  number: "Must be a number",
  min: (min: number) => `Must be at least ${min} characters`,
  max: (max: number) => `Must be at most ${max} characters`,
  email: "Must be a valid email",
  url: "Must be a valid url",
  includes: (value: string) => `Must include ${value}`,
  startsWith: (value: string) => `Must start with ${value}`,
  endsWith: (value: string) => `Must end with ${value}`,
  date: "Must be a valid date",
  time: "Must be a valid time",
  gt: (value: number) => `Must be greater than ${value}`,
  lt: (value: number) => `Must be less than ${value}`,
  between: (min: number, max: number) => `Must be between ${min} and ${max}`,
  gte: (value: number) => `Must be greater than or equal to ${value}`,
  lte: (value: number) => `Must be less than or equal to ${value}`,
  exists: (name: string) => `${capitalize(name)} already exists`,
  notFound: (name: string) => `${capitalize(name)} not found!`,
  unauthorized: "Unauthorized",
  unknownError: "Unknown error",
  notUser: "Only users can perform this action.",
  notAdmin: "Only admins can perform this action.",
  notSuperAdmin: "Only superadmins can perform this action.",
  password:
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  invalidCredentials: "Invalid credentials.",
} as const;

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
