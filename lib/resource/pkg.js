'use strict'

const R = require('ramda')
const Resource = require('./')

module.exports = class Pkg extends Resource {
	constructor (config, command) {
		super(config)

		this.actions = {
			install: this.install,
			remove: this.remove
		}

		this.command = command
	}

	install (options, mutate) {
		if (!this.command.isInstalled(options.packageName)) {
			mutate(
				`Installing package [${options.packageName}]`,
				() => this.command.install(options.packageName)
			)
		} else {
			this.log(`Package already installed [${options.packageName}]`)
		}
	}

	remove (options, mutate) {
		if (this.command.isInstalled(options.packageName)) {
			mutate(
				`Removing package [${options.packageName}]`,
				() => this.command.remove(options.packageName)
			)
		} else {
			this.log(`Package not installed [${options.packageName}]`)
		}
	}

	processOptions (name, options) {
		let processedOptions = super.processOptions(name, options)

		if (!processedOptions.packageName) {
			processedOptions.packageName = processedOptions.name
		}

		return processedOptions
	}
}
