import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';

gulp.task('styles', function(){
	return gulp.src('portfolio/resources/sass/**/*.scss')
		// .pipe(plumber({
		// 	errorHandler: function (error) {
		// 		console.log(error.message);
		// 		this.emit('end');
		// }}))
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(autoprefixer('last 3 versions'))
		.pipe(gulp.dest('theme/styles/css/'))
		.pipe(browserSync.stream())
});