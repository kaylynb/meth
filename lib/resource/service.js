'use strict'

const Resource = require('./')

module.exports = class Service extends Resource {
	constructor (config, command) {
		super(config)

		this.actions = {
			start: this.start,
			stop: this.stop,
			enable: this.enable,
			disable: this.disable,
			reload: this.reload
		}

		this.command = command
	}

	start (options, mutate) {
		const service = options.serviceName

		if (!this.command.isStarted(service)) {
			mutate(
				`Starting service [${service}]`,
				() => this.command.start(service)
			)
		} else {
			this.log(`Service already started [${service}]`)
		}
	}

	stop (options, mutate) {
		const service = options.serviceName

		if (this.command.isStarted(service)) {
			mutate(
				`Stopping service [${service}]`,
				() => this.command.stop(service)
			)
		} else {
			this.log(`Service already stopped [${service}]`)
		}
	}

	enable (options, mutate) {
		const service = options.serviceName

		if (!this.command.isEnabled(service)) {
			mutate(
				`Enabling service [${service}]`,
				() => this.command.enable(service)
			)
		} else {
			this.log(`Service already enabled [${service}]`)
		}
	}

	disable (options, mutate) {
		const service = options.serviceName

		if (this.command.isEnabled(service)) {
			mutate(
				`Disabling service [${service}]`,
				() => this.command.disable(service)
			)
		} else {
			this.log(`Service already disabled [${service}]`)
		}
	}

	reload (options, mutate) {
		mutate(
			`Reloading service [${options.serviceName}]`,
			() => this.command.reload(service)
		)
	}

	processOptions (name, options) {
		let processedOptions = super.processOptions(name, options)

		if (!processedOptions.serviceName) {
			processedOptions.serviceName = processedOptions.name
		}

		return processedOptions
	}

}
