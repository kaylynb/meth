'use strict'

const chai = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noPreserveCache()
const R = require('ramda')

chai.use(require('sinon-chai'))
const expect = chai.expect

const stubExec = stub => {
	return proxyquire('../../../lib/util/exec', {
		child_process: {
			spawnSync: stub
		}
	})
}

describe('exec{}', () => {
	const successSpy = () => sinon.spy(() => { return { status: 0, stdout: '' } })
	const errorSpy = () => sinon.spy(() => { return { error: 'fake error' } })
	const nonZeroExitSpy = () => sinon.spy(() => { return { status: 1, stderr: 'fake stderr' } })

	describe('#run()', () => {
		it('calls spawn with default shell', () => {
			const spawnSpy = successSpy()
			const exec = stubExec(spawnSpy)

			exec.run('foobar')

			expect(spawnSpy).to.be.calledWith('/bin/sh', ['-c', 'foobar'])
		})

		it('calls spawn with alternative shell', () => {
			const spawnSpy = successSpy()
			const exec = stubExec(spawnSpy)

			exec.run('foobar', {
				shell: '/bin/bash',
				shellArgs: ['-c', '-z']
			})

			expect(spawnSpy).to.be.calledWith('/bin/bash', ['-c', '-z', 'foobar'])
		})

		it('throws error when spawn has error', () => {
			const exec = stubExec(errorSpy())

			expect(R.partial(exec.run, 'foobar')).to.throw(exec.ExecError)
		})

		it('throws error when process has non-zero exit code', () => {
			const exec = stubExec(nonZeroExitSpy())

			expect(R.partial(exec.run, 'foobar')).to.throw(exec.ExecError)
		})

		it.skip('throws errors for invalid arguments', () => {
			const exec = stubExec(successSpy())

			expect(exec.run).to.throw(ArgumentError)
			expect(R.partial(exec.run, ['foobar', { shell: 5 }])).to.throw(ArgumentError)
			expect(R.partial(exec.run, ['foobar', { shellArgs: 5 }])).to.throw(ArgumentError)
		})
	})

	describe('#status()', () => {
		it('returns true on zero exit code', () => {
			const exec = stubExec(successSpy())

			expect(exec.status('foobar')).to.be.true
		})

		it('returns false on non-zero exit code', () => {
			const exec = stubExec(nonZeroExitSpy())

			expect(exec.status('foobar')).to.be.false
		})

		it('should throw on spawn error', () => {
			const exec = stubExec(errorSpy())

			expect(R.partial(exec.status, 'foobar')).to.throw(exec.ExecError)
		}),

		it.skip('throws errors for invalid arguments', () => {
			const exec = stubExec(successSpy())

			expect(exec.status).to.throw(ArgumentError)
			expect(R.partial(exec.status, ['foobar', { shell: 5 }])).to.throw(ArgumentError)
			expect(R.partial(exec.status, ['foobar', { shellArgs: 5 }])).to.throw(ArgumentError)
		})
	})
})
