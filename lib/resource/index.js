'use strict'

const R = require('ramda')

module.exports = class Resource {
	constructor (config) {
		this.config = config

		this.actions = {}
	}

	log (message) {
		this.config.log(message)
	}

	getActions () {
		return R.map(action => {
			return (name, options) => {
				const processedOptions = this.processOptions(name, options)
				const logStr = x => `${this.constructor.name}: ${x} ➜ ${action.name} [${processedOptions.name}]`
				let mutated = false
				const mutate = (description, mutateFn) => {
					mutated = true
					if (!this.config.dryRun) {
						this.log(description)
						mutateFn()
					} else {
						this.log(`Dry Run: ${description}`)
					}
				}

				this.log(logStr('Begin'))
				action.bind(this)(processedOptions, mutate)
				this.log(`${logStr('End')}\n`)

				return mutated
			}
		})(this.actions)
	}

	processOptions (name, options) {
		let processedOptions = options || {}

		processedOptions.name = name

		// TODO: real argument checking
		if (!R.is(String)(processedOptions.name)) {
			throw new Error('name must be a string')
		}

		return processedOptions
	}
}
