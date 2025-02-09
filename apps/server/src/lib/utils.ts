import { nanoid } from "nanoid";
import { z } from "zod";

export const idSchema = z.object({ id: z.string() });

export const paramsSchema = z.object({
  id: z.string(),
});

export const DEFAULT_PAGINATION_LIMIT = 25;
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(DEFAULT_PAGINATION_LIMIT),
  orderDir: z.enum(["asc", "desc"]).optional(),
});

export type TMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  requestId?: string;
};

export const paginationMetaFactory = (pagination: {
  total?: number;
  page: number;
  limit: number;
}) => {
  const { total = 0, page = 1, limit = +DEFAULT_PAGINATION_LIMIT } = pagination;
  const totalPages = Math.ceil(total / limit);
  return {
    total: +total,
    page: +page,
    limit: +limit,
    totalPages: +totalPages,
    hasPrev: +page > 1,
    hasNext: +page < totalPages,
    requestId: nanoid(),
  } satisfies TMeta;
};

export const resolvedQueryParams = <T extends Record<string, unknown>>(
  searchParams: T,
) => {
  const page = searchParams.page ? +searchParams.page : 1;
  const limit = searchParams.limit
    ? +searchParams.limit
    : +DEFAULT_PAGINATION_LIMIT;
  const offset = (page - 1) * limit;

  // const paramsMap = new Map<keyof T, T[keyof T]>(
  //   Object.entries(searchParams) as [keyof T, T[keyof T]][],
  // );

  return {
    ...searchParams,
    limit,
    offset,
    page,
    // paramsMap,
  };
};

export const createTimestampKey = (date?: Date) => {
  const now = date || new Date();
  return `${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(now.getFullYear()).slice(-2)}${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
};
