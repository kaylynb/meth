'use strict'

const Resource = require('./')
const R = require('ramda')

// TODO: This is so similar to the file resource. Should be
// able to combine them into a hierarchy? Just copypasta for now :(
module.exports = class Directory extends Resource {
	constructor (config, command) {
		super(config)

		this.actions = {
			install: this.install,
			remove: this.remove
		}

		this.command = command
	}

	install (options, mutate) {
		let desiredPermissions = options.permissions

		if (this.command.exists(options.path)) {
			if (!this.command.isDirectory(options.path)) {
				throw new Error('path is not a directory')
			}

			this.log(`Directory [${options.path}] exists`)
		} else {
			mutate(`Creating directory [${options.path}]`, () => {
				this.command.mkdir(options.path)
			})
		}

		const currentPermissions = this.command.getPermissions(options.path)
		this.log(`Permissions for directory ${options.path}:
Current: ${currentPermissions.toString()}
Desired: ${desiredPermissions ? desiredPermissions.toString() : '<none>'}`)

		if (desiredPermissions && currentPermissions.needsUpdate(desiredPermissions)) {
			mutate(`Setting permissions to [${desiredPermissions.toString()}]`, () => {
				this.command.setPermissions(options.path, desiredPermissions)
			})
		} else {
			this.log(`Permissions already set`)
		}
	}

	remove (options, mutate) {
		if (this.command.exists(options.path)) {
			if (!this.command.isDirectory(options.path)) {
				throw new Error('trying to manage non-directory resource with directory')
			}

			mutate(`Removing directory [${options.path}]`, () => {
				this.command.remove(options.path)
			})
		} else {
			this.log(`Directory does not exist [${options.path}]`)
		}
	}

	processOptions (name, options_) {
		let options = super.processOptions(name, options_)

		if (R.isNil(options.path)) {
			options.path = options.name
		}

		if (options.permissions) {
			options.permissions = new this.command.permissions(options.permissions)
		}

		return options
	}
}
