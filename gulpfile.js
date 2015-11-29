/*
Copyright 2015 Kaylyn Bogle <kaylyn@kaylyn.ink>

This file is part of meth.

meth is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

meth is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with meth.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict'

const gulp = require('gulp')
const mocha = require('gulp-mocha')
const eslint = require('gulp-eslint')

gulp.task('mocha', () => {
	return gulp.src('./test/unit/**/*.js', {
		read: false
	})
		.pipe(mocha())
})

gulp.task('eslint', () => {
	return gulp.src([
		'./gulpfile.js',
		'./lib/**/*.js',
		'./test/**/*.js'
	])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
})

gulp.task('validate', gulp.series(
	'eslint',
	'mocha'
))
