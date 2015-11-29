'use strict'

const fs = require('fs')
const crypto = require('crypto')
const R = require('ramda')

const NotImplementedError = require('../../error/not_implemented_error')
const iterableFile = require('../../util/iterable_file')

module.exports = class File {
	get permissions () {
		throw new NotImplementedError()
	}

	getPermissions (filePath) {
		throw new NotImplementedError()
	}

	setPermissions (filePath, permissions) {
		throw new NotImplementedError()
	}

	isText (filePath) {
		return false
	}

	isFile (filePath) {
		return fs.lstatSync(filePath).isFile()
	}

	isDirectory (filePath) {
		return fs.lstatSync(filePath).isDirectory()
	}

	mkdir (filePath) {
		fs.mkdirSync(filePath)
	}

	exists (filePath) {
		try {
			fs.accessSync(filePath)
		} catch (err) {
			// TODO: Check if this works on non-unix platforms
			if (err.code === 'ENOENT') {
				return false
			}
		}

		return true
	}

	remove (filePath) {
		fs.unlinkSync(filePath)
	}

	getContent (filePath) {
		return fs.readFileSync(filePath)
	}

	setContent (filePath, contents) {
		fs.writeFileSync(filePath, contents)
	}

	getContentHash (filePath, options_) {
		const options = R.merge({
			hashAlgorithm: 'sha256',
			digestEncoding: 'hex'
		}, options_)

		const hash = crypto.createHash(options.hashAlgorithm)
		const file = iterableFile(filePath, options.bufferSize)

		// Need to wrap this in try/finally block for proper cleanup due to
		// incomplete iterator implementation in node.js/v8. (see iterable_file.js
		// for more info)
		try {
			for (let content of file) {
				hash.update(content)
			}
		} finally {
			file.return()
		}

		return hash.digest(options.digestEncoding)
	}

	copy (sourcePath, destPath) {
		const sourceFile = iterableFile(sourcePath)
		const destFileHandle = fs.openSync(destPath, 'w')

		try {
			for (let content of sourceFile) {
				fs.writeSync(destFileHandle, content, 0, content.length)
			}
		} finally {
			sourceFile.return()
			fs.closeSync(destFileHandle)
		}
	}
}
