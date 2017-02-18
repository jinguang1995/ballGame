/* 
* @Author: anchen
* @Date:   2017-02-18 18:42:16
* @Last Modified by:   anchen
* @Last Modified time: 2017-02-18 18:50:22
*/

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
gulp.task('yasuo:hebing',function(){
	gulp.src('js/**/*.js')
		.pipe(uglify())
		.pipe(concat('main.min.js'))
		.pipe(gulp.dest('build'));
});
gulp.task('default',['yasuo:hebing']);