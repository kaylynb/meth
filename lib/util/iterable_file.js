'use strict'

const fs = require('fs')

// Ideally, we would design this to ensure the file buffer
// closes on abrupt termination. Unfortunately Node.js/v8 does not
// have a compliant generator/iterator implementation. It doesn't support
// abrupt termination or the `return` function, so there is no way to
// guarantee that improper use of the iterator will close the file handle :(
// See v8 issue: https://code.google.com/p/v8/issues/detail?id=3565
// For now, we just need to be very careful (with a try/finally block) when
// using this.

module.exports = function (filePath, bufferSize_) {
	const bufferSize = bufferSize_ || 2048

	let fileHandle = undefined
	let contentBuffer = undefined

	const openHandle = () => {
		// TODO: Consider if we should open in synchronous mode 'rs'
		// This would possibly slow down access. If it results in a more
		// consistent operation, it's likely a reasonable cost to pay.
		if (!fileHandle) {
			fileHandle = fs.openSync(filePath, 'r')
			contentBuffer = new Buffer(bufferSize)
		}
	}

	const closeHandle = () => {
		if (fileHandle) {
			fs.closeSync(fileHandle)
			fileHandle = undefined
		}
	}

	return {
		[Symbol.iterator] () {
			return this
		},

		next () {
			openHandle()

			const bytesRead = fs.readSync(fileHandle, contentBuffer, 0, bufferSize, null)

			if (!bytesRead) {
				return this.return()
			}

			// If the bytes read is smaller than the buffer size, we create a new
			// buffer that is exactly the right size. Otherwise the hash will not be
			// consistent across tools.
			let slicedBuffer = bytesRead < bufferSize
				? contentBuffer.slice(0, bytesRead)
				: contentBuffer

			return { value: slicedBuffer }
		},

		return () {
			closeHandle()

			return { done: true }
		}
	}
}
