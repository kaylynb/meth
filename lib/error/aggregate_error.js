'use strict'

const toArray = require('../util/to_array')

module.exports = class AggregateError extends Error {
	constructor (message, innerErrors) {
		super(message)

		this.innerErrors = toArray(innerErrors)
	}
}
