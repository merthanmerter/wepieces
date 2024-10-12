import { DEFAULT_PAGINATION_LIMIT } from "@app/server/src/constants/misc";
import { z } from "zod";

export const idSchema = z.object({ id: z.string() });

export const paramsSchema = z.object({
  id: z.string(),
});

export const paginationSchema = z.object({
  page: z.string().default("1"),
  limit: z.string().default(DEFAULT_PAGINATION_LIMIT),
  orderDir: z.enum(["asc", "desc"]).optional(),
});

export type TMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
};

export const serializePaginationProps = (pagination: {
  total?: number;
  page: number;
  limit: number;
}) => {
  const { total = 0, page = 1, limit = +DEFAULT_PAGINATION_LIMIT } = pagination;
  const totalPages = Math.ceil(total / limit);
  return {
    meta: {
      total: +total,
      page: +page,
      limit: +limit,
      totalPages: +totalPages,
      hasPrev: +page > 1,
      hasNext: +page < totalPages,
    } satisfies TMeta,
  };
};

export const serializeSearchParams = <T extends Record<string, unknown>>(
  searchParams: T,
) => {
  const page = searchParams.page ? +searchParams.page : 1;
  const limit = searchParams.limit
    ? +searchParams.limit
    : +DEFAULT_PAGINATION_LIMIT;
  const offset = (page - 1) * limit;

  return { ...searchParams, limit, offset, page };
};
