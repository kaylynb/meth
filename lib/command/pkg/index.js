'use strict'

const NotImplementedError = require('../../error/not_implemented_error')

module.exports = class Pkg {
	isInstalled (packageName) {
		throw new NotImplementedError()
	}

	install (packageName) {
		throw new NotImplementedError()
	}

	remove (packageName) {
		throw new NotImplementedError()
	}
}
