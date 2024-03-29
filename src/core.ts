import fastify, { FastifyInstance, FastifyReply, FastifyRequest, HTTPMethods } from 'fastify'
import pino from 'pino'
import 'reflect-metadata'
import { InjectionToken, container, delay, injectable, registry } from 'tsyringe'
import { AppConfig, Resolver, Route } from './types'
import { ApplicationHook, LifecycleHook } from 'fastify/types/hooks'
import { StatusCodes, rsc } from './utils'

export { FastifyReply as Rep, FastifyRequest as Req }

export const core = {
	controller: (path: string) => (target: any) => {
		injectable()(target)
		target.prototype.path = path
	},
	provider: () => (target: any) => {
		injectable()(target)
		registry([{ token: target, useToken: delay(target) }])
		target.prototype.isProvider = true
	},
}

export const send = {
	code: (status: number) => {
		return (target: any, propertyKey: string) => {
			if (!target.codes) target.codes = []
			target.codes.push({
				key: propertyKey,
				status,
			})
		}
	},

	headers: (headers: { [key: string]: string }) => {
		return (target: any, propertyKey: string) => {
			if (!target.headers) target.headers = []
			target.headers.push({
				key: propertyKey,
				headers,
			})
		}
	},
}

export const call = {
	params: (target: any, propertyKey: string, index: number) => {
		if (!target.params) target.params = []
		target.params[propertyKey] = target.params[propertyKey] || []
		target.params[propertyKey].push({ index })
		target.params[propertyKey].sort((a: any, b: any) => a.index - b.index)
	},

	query: (target: any, propertyKey: string, index: number) => {
		if (!target.query) target.query = []
		target.query[propertyKey] = target.query[propertyKey] || []
		target.query[propertyKey].push({ index })
		target.query[propertyKey].sort((a: any, b: any) => a.index - b.index)
	},

	body: (target: any, propertyKey: string, index: number) => {
		if (!target.body) target.body = []
		target.body[propertyKey] = target.body[propertyKey] || []
		target.body[propertyKey].push({ index })
		target.body[propertyKey].sort((a: any, b: any) => a.index - b.index)
	},
}

export const http = {
	GET:
		(path = '') =>
		(target: any, propertyKey: string) => {
			if (!target.metadata) target.metadata = []
			target.metadata.push({
				key: propertyKey,
				method: 'GET',
				path,
			})
		},
	POST:
		(path = '') =>
		(target: any, propertyKey: string) => {
			if (!target.metadata) target.metadata = []
			target.metadata.push({
				key: propertyKey,
				method: 'POST',
				path,
			})
		},

	PUT:
		(path = '') =>
		(target: any, propertyKey: string) => {
			if (!target.metadata) target.metadata = []
			target.metadata.push({
				key: propertyKey,
				method: 'PUT',
				path,
			})
		},

	PATCH:
		(path = '') =>
		(target: any, propertyKey: string) => {
			if (!target.metadata) target.metadata = []
			target.metadata.push({
				key: propertyKey,
				method: 'PATCH',
				path,
			})
		},

	DELETE:
		(path = '') =>
		(target: any, propertyKey: string) => {
			if (!target.metadata) target.metadata = []
			target.metadata.push({
				key: propertyKey,
				method: 'DELETE',
				path,
			})
		},

	HEAD:
		(path = '') =>
		(target: any, propertyKey: string) => {
			if (!target.metadata) target.metadata = []
			target.metadata.push({
				key: propertyKey,
				method: 'HEAD',
				path,
			})
		},

	OPTIONS:
		(path = '') =>
		(target: any, propertyKey: string) => {
			if (!target.metadata) target.metadata = []
			target.metadata.push({
				key: propertyKey,
				method: 'OPTIONS',
				path,
			})
		},
}

export class err extends Error {
	statusCode: number = rsc.INTERNAL_SERVER_ERROR

	constructor(message: string) {
		super(message)
	}

	/**
	 * @description sets the status code to 400
	 * @returns {"statusCode": 400,"error": "Bad Request","message": "..."}
	 */
	public br(): this {
		this.statusCode = rsc.BAD_REQUEST
		return this
	}
	/**
	 * @description sets the status code to 401
	 * @returns {"statusCode": 401,"error": "Unauthorized","message": "..."}
	 */
	public ua(): this {
		this.statusCode = rsc.UNAUTHORIZED
		return this
	}
	/**
	 * @description sets the status code to 403
	 * @returns {"statusCode": 403,"error": "Forbidden","message": "..."}
	 */
	public fb(): this {
		this.statusCode = rsc.FORBIDDEN
		return this
	}
	/**
	 * @description sets the status code to 404
	 * @returns {"statusCode": 404,"error": "Not Found","message": "..."}
	 */
	public nf(): this {
		this.statusCode = rsc.NOT_FOUND
		return this
	}
	/**
	 * @description sets the status code to 400
	 * @returns {"statusCode": 500,"error": "Internal Server Error","message": "..."}
	 */
	public ise(): this {
		this.statusCode = rsc.INTERNAL_SERVER_ERROR
		return this
	}
	/**
	 * @description sets the status code to 501
	 * @returns {"statusCode": 501,"error": "Not Implemented","message": "..."}
	 */
	public ni(): this {
		this.statusCode = rsc.NOT_IMPLEMENTED
		return this
	}
	/**
	 * @description sets the status code to 502
	 * @returns {"statusCode": 502,"error": "Bad Gateway","message": "..."}
	 */
	public bg(): this {
		this.statusCode = rsc.BAD_GATEWAY
		return this
	}
}

export class App {
	private readonly config: AppConfig
	private readonly controllers: InjectionToken<object>[]
	private readonly providers: InjectionToken<object>[]
	private readonly logger: pino.Logger | Console
	private readonly routes: Route[] = []
	private readonly plugins: ((app: FastifyInstance) => void)[] = []

	constructor({
		config,
		controllers,
		providers,
	}: {
		config: AppConfig
		controllers: InjectionToken<object>[]
		providers: InjectionToken<object>[]
	}) {
		this.config = config
		this.controllers = controllers
		this.providers = providers
		this.logger =
			config.logger ||
			pino({
				base: null,
				level: 'info',
				transport:
					this.config.env === 'production'
						? undefined
						: {
								target: 'pino-pretty',
								options: {
									colorize: true,
									ignore: 'pid,hostname',
								},
						  },
			})
	}

	/**
	 * @description
	 * This function is used to resolve the controllers and return an array of instances.
	 * We use tsyringe's container.resolve() to resolve the controllers.
	 * @param controllers
	 * @returns an array of instances
	 * @example const [FirstController, SecondController] = resolve(this.controllers)
	 */
	private resolver = (controllers: InjectionToken<object>[]): Resolver => {
		return controllers.map((controller) => {
			const instance = container.resolve(controller)
			return instance
		}) as Resolver
	}

	public plugin(plugin: (app: FastifyInstance) => void) {
		this.plugins.push(plugin)
		return this
	}

	private async build(controllers: Resolver) {
		for (const controller of controllers) {
			const { path, metadata } = controller

			/* if path is '/' or undefined or '' then we don't need to append the controller path */
			const controllerPath = path === '/' || !path ? '' : path

			for (const { key, method, path: pathTemplate } of metadata) {
				/* if path is '/' or undefined or '' then we don't need to append the method path */
				const url = pathTemplate === '/' || !pathTemplate ? controllerPath : `${controllerPath}${pathTemplate}`
				this.routes.push({
					method,
					url,
					handler: async (req: FastifyRequest, res: FastifyReply) => {
						const params = req.params || null
						const body = req.body || null
						const query = req.query || null

						const args = []
						if (controller.params && controller.params[key]) {
							for (const { index } of controller.params[key]) {
								args[index] = params
							}
						}
						if (controller.body && controller.body[key]) {
							for (const { index } of controller.body[key]) {
								args[index] = body
							}
						}
						if (controller.query && controller.query[key]) {
							for (const { index } of controller.query[key]) {
								args[index] = query
							}
						}

						const result = await controller[key](...args)

						if (controller.codes) {
							for (const { key: k, status } of controller.codes) {
								if (k === key) {
									res.status(status)
								}
							}
						}

						if (controller.headers) {
							for (const { key: k, headers } of controller.headers) {
								if (k === key) {
									res.headers(headers)
								}
							}
						}

						res.send(result)
					},
				})
			}
		}
	}

	public async boot() {
		const app = fastify()
		/* register the plugins */

		/* resolve the providers */
		this.resolver(this.providers)
		/* build the routes */
		await this.build(this.resolver(this.controllers))

		for (const plugin of this.plugins) {
			plugin(app)
		}

		for (const options of this.routes) {
			this.logger.info(`Registering route ${options.method} ${options.url}`)
			await app.register(
				function (app, _, done) {
					app.route(options)
					done()
				},
				{ prefix: this.config.prefix }
			)
		}

		app.listen({ port: this.config.port }, (err, address) => {
			if (err) {
				this.logger.error(err)
				process.exit(1)
			}
			this.logger.info(`Server listening on ${address}`)
		})
	}
}
