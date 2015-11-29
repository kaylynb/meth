'use strict'

const Pkg = require('./')
const exec = require('../../util/exec')

// TODO: Ensure only one package is passed through packageName
// TODO: Figure out how to manage package groups
// Probably should throw error for simplicity? Otherwise managing versions will
// be complicated

module.exports = class PkgPacman extends Pkg {
	isInstalled (packageName) {
		return exec.status(`pacman -Qi ${exec.escape(packageName)}`)
	}

	install (packageName) {
		exec.run(`pacman -S --noconfirm --noprogressbar ${exec.escape(packageName)}`)
	}

	remove (packageName) {
		exec.run(`pacman -R --noconfirm --noprogressbar ${exec.escape(packageName)}`)
	}
}
