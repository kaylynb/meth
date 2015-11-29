'use strict'

const childProcess = require('child_process')
const shellwords = require('shellwords')
const R = require('ramda')

class ExecError extends Error {
	constructor (command, spawn) {
		super(`execution of command failed [${command}]: ${(spawn.error || spawn.stderr).toString()}`)

		this.spawn = spawn
	}
}

const exec = (command, options) => {
	const defaults = {
		shell: '/bin/sh',
		shellArgs: ['-c']
	}

	const opts = R.merge(defaults, options)

	// Just run spawn with the shell and join the shell args with the command
	return childProcess.spawnSync(opts.shell, [...opts.shellArgs, command], {
		// This hides the output in the console when run
		stdio: [null, null, null]
	})
}

module.exports = {
	ExecError,
	run (command, options) {
		const ret = exec(command, options)

		if (ret.error || ret.status !== 0) {
			throw new ExecError(command, ret)
		}

		return ret.stdout.toString().trim()
	},
	status (command, options) {
		const ret = exec(command, options)

		// Still want to throw error if it's unrelated to the status code
		if (ret.error) {
			throw new ExecError(command, ret)
		}

		return ret.status === 0
	},
	escape (str) {
		return shellwords.escape(str)
	}
}
