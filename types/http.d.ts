import pino from 'pino'

export type HttpMetadata = {
	method: string
	path: string
	propertyKey: string
} | null
export type Resolver = [propertyKey: string] | [propertyKey: string, ...args: any[]]
export declare class AppConfig {
	env: 'production' | 'development'
	port: number
	logger?: pino.Logger | Console
}
