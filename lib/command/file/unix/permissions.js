'use strict'

const R = require('ramda')

const ArgumentError = require('../../../error/argument_error')

const isStringOrNumber = R.either(R.is(String), R.is(Number))
const stringOrNumberErrorMessage = 'must be a string or number'

const permissionsSymbol = Symbol()

module.exports = class UnixPermissions {
	constructor (options_) {
		const options = options_ || {}
		const anyDefined = R.any(R.complement(R.isNil))

		this[permissionsSymbol] = {}

		if (!anyDefined([options.mode, options.owner, options.group])) {
			throw new ArgumentError('options', 'must provide one or more of [mode, owner, group]')
		}

		if (!R.isNil(options.mode)) {
			this.mode = options.mode
		}

		if (!R.isNil(options.owner)) {
			this.owner = options.owner
		}

		if (!R.isNil(options.group)) {
			this.group = options.group
		}
	}

	get mode () {
		return this[permissionsSymbol].mode
	}

	set mode (value) {
		let mode = undefined

		if (R.is(String)(value)) {
			mode = parseInt(value, 8)
		} else if (R.is(Number)(value)) {
			mode = value
		} else {
			throw new ArgumentError('mode', stringOrNumberErrorMessage)
		}

		if (Number.isNaN(mode) || mode > 0o777) {
			throw new ArgumentError('mode', 'must be valid unix file mode')
		}

		this[permissionsSymbol].mode = mode
	}

	get owner () {
		return this[permissionsSymbol].owner
	}

	set owner (value) {
		if (!isStringOrNumber(value)) {
			throw new ArgumentError('owner', stringOrNumberErrorMessage)
		}

		this[permissionsSymbol].owner = value
	}

	get group () {
		return this[permissionsSymbol].group
	}

	set group (value) {
		if (!isStringOrNumber(value)) {
			throw new ArgumentError('group', stringOrNumberErrorMessage)
		}

		this[permissionsSymbol].group = value
	}

	toString () {
		const mode = (this.mode && this.mode.toString(8)) || '<no mode>'
		const owner = this.owner || '<no owner>'
		const group = this.group || '<no group>'

		return `${mode} ${owner}:${group}`
	}

	needsUpdate (other) {
		const check = prop => {
			if (!R.isNil(other[prop])) {
				if (this[prop] !== other[prop]) {
					return true
				}
			}
		}

		return check('mode') || check('owner') || check('group')
	}
}
