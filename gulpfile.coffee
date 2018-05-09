gulp		= require 'gulp'
del			= require 'del'
pug			= require 'gulp-pug'
prettify	= require 'gulp-prettify'
coffee		= require 'gulp-coffee'
scss		= require 'gulp-sass'
sourcemaps	= require 'gulp-sourcemaps'
cache		= require 'gulp-cached'
#concat		= require 'gulp-concat'

gulp.task 'unbuild', ->
	del [
		'./build/**/*'
	]

gulp.task 'compile-coffee', ->
	gulp.src './src/coffees/**/*.coffee', base: './src/coffees/'
		.pipe cache 'coffees'
		.pipe sourcemaps.init()
		.pipe coffee bare: true
		.pipe sourcemaps.write './maps'
		.pipe gulp.dest './build/js/'
	
gulp.task 'compile-pug', ->
	gulp.src 'pugs/**/*.pug', base: './src/pugs/'
		.pipe cache 'pug'
		.pipe sourcemaps.init()
		.pipe pug pretty: '	'
		.pipe sourcemaps.write './maps'
		.pipe gulp.dest './build/'

gulp.task 'compile-sass', ->
	gulp.src('sass/**/*.scss', base: './src/sass/')
		.pipe scss().on('error', scss.logError)
		.pipe gulp.dest('./build/styles')
		
gulp.task 'watch', ->
	gulp.watch 'src/coffees/**/*.coffee', gulp.parallel 'compile-coffee'
	gulp.watch 'src/templates/**/*.pug', gulp.parallel 'compile-pug'
	gulp.watch 'src/sass/**/*.scss', gulp.parallel 'compile-sass'

gulp.task 'build', gulp.parallel 'compile-pug', 'compile-coffee' , 'compile-sass'
gulp.task 'build-clean', gulp.series 'unbuild', 'build'
gulp.task 'default', gulp.series 'build-clean', 'watch'