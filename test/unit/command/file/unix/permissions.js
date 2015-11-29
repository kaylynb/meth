'use strict'

const expect = require('chai').expect

const UnixPermissions = require('../../../../../lib/command/file/unix/permissions.js')
const ArgumentError = require('../../../../../lib/error/argument_error')


describe('command/file/unix/UnixPermissions', () => {
	it('should throw when constructing with no permissions', () => {
		const construct = () => {
			new UnixPermissions()
		}

		expect(construct).to.throw(ArgumentError)
	})

	it('should be able to construct from another', () => {
		const p1 = new UnixPermissions({ mode: '555' })
		const p2 = new UnixPermissions(p1)

		expect(p2.mode).to.equal(0o555)
	})

	describe('#mode', () => {
		const modeConstruct = (mode) => {
			return () => {
				return new UnixPermissions({
					mode
				})
			}
		}

		const modeSet = (mode) => {
			return () => {
				const p = new UnixPermissions({ mode: 0o777 })
				p.mode = mode

				return p
			}
		}

		it('should throw on invalid mode', () => {
			const check = (mode) => {
				expect(modeConstruct(mode)).to.throw(ArgumentError)
				expect(modeSet(mode)).to.throw(ArgumentError)
			}

			check(777)
			check('888')
			check(Symbol())
			check(null)
		})

		it('should not throw on valid mode', () => {
			const check = (mode, expected) => {
				expected = expected || mode

				const constructed = modeConstruct(mode)()
				const set = modeSet(mode)()

				expect(constructed.mode).to.equal(expected)
				expect(set.mode).to.equal(expected)
			}

			check(0o777)
			check('777', 0o777)
			check('555', 0o555)
			check(0o000)
		})
	})
})
