'use strict'

const chai = require('chai')
const sinon = require('sinon')
const R = require('ramda')

// Use noCallThru so we don't inadvertently run commands while testing
const proxyquire = require('proxyquire').noPreserveCache().noCallThru()

chai.use(require('sinon-chai'))
const expect = chai.expect

const stubPkgPacman = stub => {
	const defaultStub = {
		// Use simple escape sequence so we can check escape location
		escape: x => `[${x}]`
	}

	return new (proxyquire('../../../../lib/command/pkg/pacman', {
		'../../util/exec': R.merge(defaultStub, stub)
	}))()
}

describe('command/pkg/PkgPacman', () => {
	describe('#isInstalled()', () => {
		it('should check for installed package', () => {
			const stub = {
				status: sinon.spy(() => true)
			}
			const pkg = stubPkgPacman(stub)

			expect(pkg.isInstalled('foobar')).to.be.true
			expect(stub.status).to.be.calledWith('pacman -Qi [foobar]')
		})
	})

	describe('#install()', () => {
		it('should install a package', () => {
			const stub = {
				run: sinon.stub()
			}
			const pkg = stubPkgPacman(stub)

			pkg.install('foobar')
			expect(stub.run).to.be.calledWith('pacman -S --noconfirm --noprogressbar [foobar]')
		})
	})

	describe('#remove()', () => {
		it('should remove a package', () => {
			const stub = {
				run: sinon.stub()
			}
			const pkg = stubPkgPacman(stub)

			pkg.remove('foobar')
			expect(stub.run).to.be.calledWith('pacman -R --noconfirm --noprogressbar [foobar]')
		})
	})
})
