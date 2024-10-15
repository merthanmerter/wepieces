import { aliasedTable } from "drizzle-orm";
import { users } from "./schema";

/**
 * This function returns a safe object with only the columns that are needed
 * for the user table.
 * @param userAlias The aliased table for the user table.
 */
function getSafeUserColumns(userAlias: typeof users) {
  return {
    id: userAlias.id,
    username: userAlias.username,
    email: userAlias.email,
    role: userAlias.role,
  };
}

/**
 * This utility function joins the user table with the relation tables.
 * It returns an object with the aliased tables and the safe columns.
 */
export function usersAlias() {
  const createdByAlias = aliasedTable(users, "createdByUser");
  const updatedByAlias = aliasedTable(users, "updatedByUser");

  return {
    createdBy: getSafeUserColumns(createdByAlias),
    updatedBy: getSafeUserColumns(updatedByAlias),
    users: {
      createdBy: createdByAlias,
      updatedBy: updatedByAlias,
    },
  };
}
