import { InjectionToken } from 'tsyringe';
import pino from 'pino';
export { FastifyReply as Rep, FastifyRequest as Req } from 'fastify';

declare class AppConfig {
	env: 'production' | 'development'
	port: number
	logger?: pino.Logger | Console
}

declare const core: {
    controller: (path: string) => (target: any) => void;
    provider: () => (target: any) => void;
};
declare const send: {
    code: (status: number) => (target: any, propertyKey: string) => void;
    headers: (headers: {
        [key: string]: string;
    }) => (target: any, propertyKey: string) => void;
};
declare const call: {
    params: (target: any, propertyKey: string, index: number) => void;
    query: (target: any, propertyKey: string, index: number) => void;
    body: (target: any, propertyKey: string, index: number) => void;
};
declare const http: {
    GET: (path?: string) => (target: any, propertyKey: string) => void;
    POST: (path?: string) => (target: any, propertyKey: string) => void;
    PUT: (path?: string) => (target: any, propertyKey: string) => void;
    PATCH: (path?: string) => (target: any, propertyKey: string) => void;
    DELETE: (path?: string) => (target: any, propertyKey: string) => void;
    HEAD: (path?: string) => (target: any, propertyKey: string) => void;
    OPTIONS: (path?: string) => (target: any, propertyKey: string) => void;
};
declare class App {
    private readonly config;
    private readonly controllers;
    private readonly providers;
    private readonly logger;
    constructor({ config, controllers, providers, }: {
        config: AppConfig;
        controllers: InjectionToken<object>[];
        providers: InjectionToken<object>[];
    });
    /**
     * @description
     * This function is used to resolve the controllers and return an array of instances.
     * We use tsyringe's container.resolve() to resolve the controllers.
     * @param controllers
     * @returns an array of instances
     * @example const [FirstController, SecondController] = resolve(this.controllers)
     */
    private resolver;
    /**
     * @description
     * This function is used to  extract route parameters from the URL.
     * @param url The URL to extract parameters from
     * @param pathTemplate The path template to use for extracting parameters
     * @returns an object containing the route parameters
     * @example const params = extractor('/first/James/007', '/first/:name/:id')
     * @example console.log(params) // { name: 'James', id: '007' }
     */
    boot(): void;
}

export { App, call, core, http, send };
