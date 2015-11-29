'use strict'

const NotImplementedError = require('../../error/not_implemented_error')

module.exports = class Service {
	enable (serviceName) {
		throw new NotImplementedError()
	}

	disable (serviceName) {
		throw new NotImplementedError()
	}

	start (serviceName) {
		throw new NotImplementedError()
	}

	stop (serviceName) {
		throw new NotImplementedError()
	}

	restart (serviceName) {
		throw new NotImplementedError()
	}

	reload (serviceName) {
		throw new NotImplementedError()
	}

	isEnabled (serviceName) {
		throw new NotImplementedError()
	}

	isStarted (serviceName) {
		throw new NotImplementedError()
	}
}
