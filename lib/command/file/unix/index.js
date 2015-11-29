'use strict'

const R = require('ramda')

const File = require('../')
const UnixPermissions = require('./permissions')
const exec = require('../../../util/exec')

module.exports = class FileUnix extends File {
	get permissions () {
		return UnixPermissions
	}

	getPermissions (filePath) {
		const escapedFilePath = exec.escape(filePath)

		return new UnixPermissions({
			mode: exec.run(`stat -c %a ${escapedFilePath}`),
			owner: exec.run(`stat -c %U ${escapedFilePath}`),
			group: exec.run(`stat -c %G ${escapedFilePath}`)
		})
	}

	setPermissions (filePath, permissions) {
		const filePermissions = new UnixPermissions(permissions)
		const escapedFilePath = exec.escape(filePath)
		const mode = filePermissions.mode.toString(8)
		const owner = filePermissions.owner
		const group = filePermissions.group

		if (!R.isNil(mode)) {
			exec.run(`chmod ${exec.escape(mode)} ${escapedFilePath}`)
		}

		if (!R.isNil(owner) && !R.isNil(group)) {
			exec.run(`chown ${exec.escape(owner)}:${exec.escape(group)} ${escapedFilePath}`)
		} else if (!R.isNil(owner)) {
			exec.run(`chown ${exec.escape(owner)} ${escapedFilePath}`)
		} else if (!R.isNil(group)) {
			exec.run(`chgrp ${exec.escape(group)} ${escapedFilePath}`)
		}
	}

	isText (filePath) {
		return exec.status(`file --mime-type --brief ${exec.escape(filePath)} | grep text`)
	}
}
