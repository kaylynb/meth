'use strict'

const R = require('ramda')

module.exports = config_ => {
	const defaultConfig = {
		log (message) {
			console.log(message)
		},
		dryRun: true
	}

	const config = R.merge(defaultConfig, config_)

	return {
		// TODO: Probably remove this?
		initResource(resource, command) {
			return new resource(config, new command()).getActions()
		}
	}
}
