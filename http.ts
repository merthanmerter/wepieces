export const HttpMetadataKey = Symbol('HttpMetadata')
import nodehttp from 'http'
import pino from 'pino'
import { InjectionToken, container } from 'tsyringe'
import { AppConfig, HttpMetadata, Resolver } from './types'

export const http = {
	GET(path: string): MethodDecorator {
		return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
			Reflect.defineMetadata(
				HttpMetadataKey,
				{ method: 'GET', path, propertyKey },
				target.constructor,
				propertyKey.toString()
			)
		}
	},

	POST(path: string): MethodDecorator {
		return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
			Reflect.defineMetadata(
				HttpMetadataKey,
				{ method: 'POST', path, propertyKey },
				target.constructor,
				propertyKey.toString()
			)
		}
	},

	PUT(path: string): MethodDecorator {
		return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
			Reflect.defineMetadata(
				HttpMetadataKey,
				{ method: 'PUT', path, propertyKey },
				target.constructor,
				propertyKey.toString()
			)
		}
	},

	PATCH(path: string): MethodDecorator {
		return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
			Reflect.defineMetadata(
				HttpMetadataKey,
				{ method: 'PATCH', path, propertyKey },
				target.constructor,
				propertyKey.toString()
			)
		}
	},

	DELETE(path: string): MethodDecorator {
		return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
			Reflect.defineMetadata(
				HttpMetadataKey,
				{ method: 'DELETE', path, propertyKey },
				target.constructor,
				propertyKey.toString()
			)
		}
	},

	OPTIONS(path: string): MethodDecorator {
		return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
			Reflect.defineMetadata(
				HttpMetadataKey,
				{ method: 'OPTIONS', path, propertyKey },
				target.constructor,
				propertyKey.toString()
			)
		}
	},

	HEAD(path: string): MethodDecorator {
		return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
			Reflect.defineMetadata(
				HttpMetadataKey,
				{ method: 'HEAD', path, propertyKey },
				target.constructor,
				propertyKey.toString()
			)
		}
	},
} as const

export const methods = Object.keys(http).map((key) => key.toLowerCase())

export const getHttpMetadata = (target: any, propertyKey: string): HttpMetadata => {
	return Reflect.getMetadata(HttpMetadataKey, target.constructor, propertyKey) as HttpMetadata
}

export class App {
	private readonly config: AppConfig
	private readonly controllers: InjectionToken<object>[]
	private readonly logger: pino.Logger | Console

	constructor({ config, controllers }: { config: AppConfig; controllers: InjectionToken<object>[] }) {
		this.config = config
		this.controllers = controllers
		this.logger = config.logger || console
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

	/**
	 * @description
	 * This function is used to  extract route parameters from the URL.
	 * @param url The URL to extract parameters from
	 * @param pathTemplate The path template to use for extracting parameters
	 * @returns an object containing the route parameters
	 * @example const params = extractor('/first/James/007', '/first/:name/:id')
	 * @example console.log(params) // { name: 'James', id: '007' }
	 */
	private extractor(url: string, pathTemplate?: string) {
		if (!pathTemplate) return null // Return null immediately if pathTemplate is undefined, null, or empty

		const urlSegments = url.split('/')
		const pathSegments = pathTemplate.split('/')

		if (urlSegments.length !== pathSegments.length) return null // If the number of segments do not match, return null

		const parameters: { [key: string]: string } = {}
		for (let i = 0; i < pathSegments.length; i++) {
			const isParameter = pathSegments[i].startsWith(':')
			const parameterName = pathSegments[i].substring(1)
			const urlSegment = urlSegments[i]

			if (isParameter) {
				if (urlSegment !== '') parameters[parameterName] = urlSegment // Skip empty URL segments to avoid adding empty strings
			} else if (pathSegments[i] !== urlSegments[i]) return null // URL segment does not match the path template
		}

		if (Object.keys(parameters).length === 0) return null // Check if the parameters object is empty, indicating that only empty strings were found

		return parameters
	}

	private router = async (
		req: nodehttp.IncomingMessage,
		res: nodehttp.ServerResponse<nodehttp.IncomingMessage> & {
			req: nodehttp.IncomingMessage
		},
		controllers: Resolver
	) => {
		const { method, url } = req

		const notFound = () => {
			res.statusCode = 404
			res.write('Not Found')
			res.end()
			return
		}

		if (!method || !url) return notFound()

		try {
			let handled = false
			for (const controller of controllers) {
				for (const key of methods) {
					const metadata = getHttpMetadata(controller, key)
					if (method.toLowerCase() === key) {
						const normalizedUrl = url.endsWith('/') ? url.slice(0, -1) : url // Remove trailing slash if present
						const params = this.extractor(normalizedUrl, metadata?.path) // Extract route parameters
						if (metadata?.path && params) {
							res.req = req
							const result = await controller[metadata.propertyKey](...Object.values(params))
							res.statusCode = 200
							res.write(result)
							res.end()
							handled = true
							break
						}
					}
				}
				if (handled) break
			}

			if (!handled) {
				return notFound()
			}
		} catch (error) {
			console.error('Server error:', error)
			res.statusCode = 500
			res.write('Internal Server Error')
			res.end()
		}
	}

	public build() {
		const controllers = this.resolver(this.controllers)
		const router = (req: nodehttp.IncomingMessage, res: nodehttp.ServerResponse<nodehttp.IncomingMessage>) =>
			this.router(req, res, controllers)
		return { router }
	}

	public boot() {
		const { router } = this.build()
		const server = nodehttp.createServer(router)

		if (this.logger) {
			server.on('request', (req, res) => {
				this.logger.info(`Request: ${req.method} ${req.url}`)
				this.logger.info(`Response: ${res.statusCode}`)
			})

			server.on('error', (error) => {
				this.logger.error(error)
			})
		}

		server.listen(this.config.port, () => {
			this.logger.info(`Server listening on port ${this.config.port}`)
		})
	}
}
