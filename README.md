<div align="center">

<h3 align="center">Wepieces v1.0.0</h3>

</div>

```ts
import { App } from 'wepieces/src'
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

```ts
import { call, core, http, inj, rsc, send } from 'wepieces/src'
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
