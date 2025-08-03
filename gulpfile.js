const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer').default;

gulp.task('styles', function(done) {
    const stream = gulp.src('src/styles/sass/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(autoprefixer())
        .pipe(gulp.dest('src/styles/css/'));
    
    stream.on('finish', done);
    return stream;
}); 