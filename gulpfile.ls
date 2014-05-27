require! <[gulp gulp-util express connect-livereload tiny-lr gulp-livereload path]>

app = express!
lr = tiny-lr!

gulp.task 'index' ->
    gulp.src './index.html'
        .pipe gulp-livereload lr

gulp.task 'background' ->
    gulp.src './background/*'
        .pipe gulp-livereload lr

gulp.task 'template' ->
    gulp.src './template/*.html'
        .pipe gulp-livereload lr

gulp.task 'script' ->
    gulp.src './script/*.js'
        .pipe gulp-livereload lr

gulp.task 'style' ->
    gulp.src './style/*.css'
        .pipe gulp-livereload lr

gulp.task 'content' ->
    gulp.src './content/*'
        .pipe gulp-livereload lr

gulp.task 'resource' ->
    gulp.src './res/*'
        .pipe gulp-livereload lr

gulp.task 'server', ->
    app.use connect-livereload!
    app.use express.static path.resolve '.'
    app.listen 3000
    gulp-util.log 'listening on port 3000'

gulp.task 'watch', ->
    lr.listen 35729, ->
        return gulp-util.log it if it
    gulp.watch './index.html', <[index]>
    gulp.watch './background/*', <[background]>
    gulp.watch './template/*.html', <[template]>
    gulp.watch './script/*.js', <[script]>
    gulp.watch './style/*.css', <[stylus]>
    gulp.watch './content/*', <[content]>

gulp.task 'dev', <[server watch]>
gulp.task 'default', <[build]>
