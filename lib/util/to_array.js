'use strict'

module.exports = value => {
	if (value === undefined) {
		return []
	}

	if (Array.isArray(value)) {
		return value
	}

	return [value]
}
