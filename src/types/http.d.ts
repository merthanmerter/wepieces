import { FastifyReply, FastifyRequest, HTTPMethods } from 'fastify'
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
export interface Route {
	method: HTTPMethods
	url: string
	handler: (req: FastifyRequest, res: FastifyReply) => void
}
