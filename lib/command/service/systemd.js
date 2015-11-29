'use strict'

const Service = require('./')
const exec = require('../../util/exec')

module.exports = class ServiceSystemd extends Service {
	enable (serviceName) {
		exec.run(`systemctl --quiet enable ${exec.escape(serviceName)}`)
	}

	disable (serviceName) {
		exec.run(`systemctl --quiet disable ${exec.escape(serviceName)}`)
	}

	start (serviceName) {
		exec.run(`systemctl --quiet start ${exec.escape(serviceName)}`)
	}

	stop (serviceName) {
		exec.run(`systemctl --quiet stop ${exec.escape(serviceName)}`)
	}

	reload (serviceName) {
		exec.run(`systemctl --quiet reload ${exec.escape(serviceName)}`)
	}

	isEnabled (serviceName) {
		return exec.status(`systemctl --quiet is-enabled ${exec.escape(serviceName)}`)
	}

	isStarted (serviceName) {
		return exec.status(`systemctl --quiet is-active ${exec.escape(serviceName)}`)
	}
}
