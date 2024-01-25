/**
 * @description Response Status Codes
 */
export const rsc = {
	/**
	 * @description 200 OK
	 */
	OK: 200,
	/**
	 * @description 201 CREATED
	 */
	CREATED: 201,
	/**
	 * @description 400 BAD_REQUEST
	 */
	BAD_REQUEST: 400,
	/**
	 * @description 401 UNAUTHORIZED
	 */
	UNAUTHORIZED: 401,
	/**
	 * @description 403 FORBIDDEN
	 */
	FORBIDDEN: 403,
	/**
	 * @description 404 NOT_FOUND
	 */
	NOT_FOUND: 404,
	/**
	 * @description 500 INTERNAL_SERVER_ERROR
	 */
	INTERNAL_SERVER_ERROR: 500,
	/**
	 * @description 501 NOT_IMPLEMENTED
	 */
	NOT_IMPLEMENTED: 501,
	/**
	 * @description 502 BAD_GATEWAY
	 */
	BAD_GATEWAY: 502,
} as const

export type StatusCodes = 200 | 201 | 400 | 404 | 500
