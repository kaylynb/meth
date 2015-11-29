'use strict'

const expect = require('chai').expect

const toArray = require('../../../lib/util/to_array')

const testValToArray = vals => {
	vals.forEach(val => expect(toArray(val)).to.eql([val]))
}

describe('to_array()', () => {
	it('should return an empty array when passed undefined', () => {
		expect(toArray()).to.eql([])
	})

	it('should return array when passed other falsy values', () => {
		testValToArray([null, false, 0, '', Number.NaN])
	})

	it('should return array for non falsy values', () => {
		testValToArray([true, 1, 'foo', Symbol(), {}, { foo: 'bar' }, x => x + 1])
	})

	it('should return array from array', () => {
		const testArray = [undefined, false, true, {}, 'foo', 25, Symbol('foo'), x => x + 1]

		expect(toArray(testArray)).to.eql(testArray)
	})
})
