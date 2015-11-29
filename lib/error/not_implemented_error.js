'use strict'

module.exports = class NotImplementedError extends Error {
	constructor () {
		super('Not implemented')
	}
}
