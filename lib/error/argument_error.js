'use strict'

module.exports = class ArgumentError extends Error {
	constructor (argumentName, errorMessage) {
		super(`Argument [${argumentName}] does not satisfy condition [${errorMessage}]`)
	}
}
