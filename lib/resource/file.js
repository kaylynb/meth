'use strict'

const R = require('ramda')
const diff = require('diff')
const crypto = require('crypto')

const Resource = require('./')
const ArgumentError = require('../error/argument_error')

const getHash = content => {
	const hash = crypto.createHash('sha256')

	hash.update(content)

	return hash.digest('hex')
}

module.exports = class File extends Resource {
	constructor (config, command) {
		super(config)

		this.actions = {
			install: this.install,
			remove: this.remove
		}

		this.command = command
	}

	getSourceHash (options) {
		if (options.content) {
			return getHash(options.content)
		} else {
			return this.command.getContentHash(options.source)
		}
	}

	install (options, mutate) {
		let desiredPermissions = options.permissions
		const mutateFile = () => {
			mutate(`Installing file [${options.path}]`, () => {
				// TODO: Diff the file too. For now, just assume content is text. This will
				// need to be revisited later...
				let preText = undefined
				if (options.content || this.command.isText(options.source)) {
					if (this.command.exists(options.path)) {
						preText = this.command.getContent(options.path).toString()
					} else {
						preText = ''
					}
				}

				if (options.content) {
					this.command.setContent(options.path, options.content)
				} else {
					this.command.copy(options.source, options.path)
				}

				if (preText !== undefined) {
					const postText = this.command.getContent(options.path).toString()
					const patch = diff.createPatch(
						options.path,
						preText,
						postText,
						'',
						''
					)

					this.log(patch)
				}
			})
		}

		if (this.command.exists(options.path)) {
			if (!this.command.isFile(options.path)) {
				throw new Error('path is not a file')
			}

			const sourceHash = this.getSourceHash(options)
			const destHash = this.command.getContentHash(options.path)
			const destPermissions = this.command.getPermissions(options.path)

			this.log(`File [${options.path}] exists:
Source: ${sourceHash}
Dest  : ${destHash}`)

			if (sourceHash !== destHash) {

				// If no permissions set, we still want to ensure they don't change
				// after mutating.
				if (!desiredPermissions) {
					desiredPermissions = destPermissions
				}

				mutateFile()
			} else {
				this.log(`File matches [${options.path}]`)
			}
		} else {
			this.log(`File [${options.path}] does not exist`)
			mutateFile()
		}

		const currentPermissions = this.command.getPermissions(options.path)
		this.log(`Permissions for file ${options.path}:
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
			if (!this.command.isFile(options.path)) {
				throw new Error('trying to manage non-file resource with file')
			}

			mutate(`Removing file [${options.path}]`, () => {
				this.command.remove(options.path)
			})
		} else {
			this.log(`File does not exist [${options.path}]`)
		}
	}

	processOptions (name, options_) {
		let options = super.processOptions(name, options_)

		if (R.isNil(options.path)) {
			options.path = options.name
		}

		if (!R.isNil(options.source) && !R.isNil(options.content)) {
			throw new Error('Cannot have both source and content options')
		}

		if (R.isNil(options.source) && R.isNil(options.content)) {
			throw new Error('must have either source or content option')
		}

		if (options.permissions) {
			options.permissions = new this.command.permissions(options.permissions)
		}

		if (!R.isNil(options.content)) {
			if (R.is(String)(options.content)) {
				options.content = new Buffer(options.content)
			} else if (!options.content instanceof Buffer) {
				throw new ArgumentError('options.content', 'must be a string or a buffer')
			}
		}

		return options
	}
}
