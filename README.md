<p align="center">
  <a href="https://www.whetherwepieces.com/">
    <h1 align="center" style="font-size:4rem;">WEPIECES</h1>
  </a>
</p>

<p align="center">
  <a aria-label="Fastify logo" href="https://fastify.dev/">
    <img src="https://img.shields.io/badge/MADE%20WITH%20FASTIFY-000000.svg?style=for-the-badge&logo=FASTIFY&labelColor=000">
  </a>
  <a aria-label="License" href="https://www.whetherwepieces.com/">
    <img alt="" src="https://img.shields.io/npm/l/wepieces.svg?style=for-the-badge&labelColor=000000">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/wepieces">
    <img alt="" src="https://img.shields.io/npm/v/wepieces.svg?style=for-the-badge&labelColor=000000">
  </a>
  <a aria-label="Join the community on GitHub" href="https://github.com/merthanmerter/wepieces">
    <img alt="" src="https://img.shields.io/badge/Join%20the%20community-blue.svg?style=for-the-badge">
  </a>
</p>

## General Information

A journey to creating a fast, robust, secure and modern opinionated meta-framework.
Bringing together the modern and most maintained tools like fastify, tsyringe, reflect-metadata

## Alpha Roadmap

- [ ] type validation pipes
- [ ] guards
- [ ] injectable middlewares
- [ ] task scheduling

```ts
// ./src/controller/bond-controller.ts
import { call, core, http, inj, rsc, send } from 'wepieces/core'
import { BondService } from '../service/bond-service'

@core.controller('/bond')
export class BondController {
	constructor(@inj(BondService) private service: BondService) {}

	/* /bond/james/007?gun=walther&car=aston-martin */

	@http.GET('/:name/:id')
	@send.code(rsc.OK)
	@send.headers({ 'x-custom-header': 'custom-value' })
	async getBond(@call.params params: { name: string; id: string }, @call.query query: { gun: string; car: string }) {
		return this.service.getBond(params.name, params.id, query.gun, query.car)
	}

	@http.POST('/')
	@send.code(rsc.CREATED)
	async postBond() {
		return this.service.postBond()
	}
}
```

```ts
// ./src/service/bond-service.ts
import { core, err } from 'wepieces/core'
import { aan } from '../helper/a-an'

@core.provider()
export class BondService {
	public async getBond(name: string, id: string, gun: string, car: string) {
		return `Hello ${name}! Your id is ${id} and you have ${aan(gun)} and ${aan(car)}.`
	}

	public async postBond() {
		// return 'post from bond service'
		throw new err('post failed').br()
	}
}
```

```ts
// ./src/app.ts
import { App } from 'wepieces/core'
import { BondController } from './controller/bond-controller'
import { MoneypennyController } from './controller/moneypenny-controller'
import { BondService } from './service/bond-service'
import { MoneypennyService } from './service/moneypenny-service'

new App({
	config: {
		env: (process.env.NODE_ENV as '') || 'development',
		port: 3000,
		// prefix: '/v1',
		// logger,
	},
	controllers: [BondController, MoneypennyController],
	providers: [BondService, MoneypennyService],
})
	// optional plugins
	.plugin((app) => {
		// app.register(function (instance, _, done) {
		// 	instance.register(require('fastify-cors'), {
		// 		origin: true,
		// 	})
		// 	done()
		// })

		app.route({
			method: 'GET',
			url: '/health',
			handler: async (_, res) => {
				res.send({ status: 'ok' })
			},
		})

		app.addHook('preValidation', (request, reply, done) => {
			if (request.url != '/secret') {
				done()
			} else {
				done(new Error('Not allowed'))
			}
		})
	})
	.boot()
```

## Authors

- Merthan Merter ([@merthan_merter](https://twitter.com/merthan_merter))
