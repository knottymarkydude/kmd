
import gulp from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import gulpif from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import imagemin from 'gulp-imagemin';
import del from 'del';
import webpack from 'webpack-stream';
import uglify from 'gulp-uglify';
import named from 'vinyl-named';
import browserSync from 'browser-sync';
import zip from 'gulp-zip';
import replace from 'gulp-replace';
import info from './package.json';

const server = browserSync.create();
const PRODUCTION = yargs.argv.prod;

const paths = {
  styles: {
    src: ['src/assets/sass/style.scss', 'src/assets/sass/admin.scss'],
    dest: 'dist/assets/css/'
  },
  scripts: {
    src: ['src/assets/js/bundle.js','src/assets/js/admin.js'],
    dest: 'dist/assets/js/'
  },
  images: {
    src: 'src/assets/gfx/**/*.{jpg,jpeg,png,svg,gif}',
    dest: 'dist/assets/gfx/'
  },
  other: {
    src: ['src/assets/**/*', '!src/assets/{gfx,js,sass}', '!src/assets/{gfx,js,sass}/**/*'],
    dest: 'dist/assets/'
  },
  package : {
    src: ['**/*', '!node_modules{,/**}', '!packaged{,/**}', '!.git{,/**}','!src{,/**}',
    '!.gitignore', '!gulpfile.babel.js', '!package.json', '!package-lock.json',
    '!git.txt', '!npm-install.txt'],
    dest: 'packaged'
  }
}

export const styles = (done) => {
  console.log(PRODUCTION);

  return gulp.src(paths.styles.src)
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(PRODUCTION, cleanCSS({compatibility: 'ie8'})))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()) )
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(server.stream());
}

export const scripts = () => {
    return gulp.src(paths.scripts.src)
        .pipe(named())
        .pipe(webpack({
              module: {
                  rules: [
                    {
                          test: /\.js$/,
                          use: {
                              loader: 'babel-loader',
                              options: {
                                presets: ['@babel/preset-env']
                              }
                          }
                    }
                  ]
              },
              output: {
                filename: '[name].js'
              },
              // If we add jQuery using webpack here, we add import $ from 'jquery'; to the
              // js file, and no need to enqueue it in the function file.
              externals: {
                jquery: 'jQuery'
              },
              devtool: !PRODUCTION ? 'inline-source-map' : false,
              //devtool: !PRODUCTION ? 'source-map' : false,
              mode: PRODUCTION ? 'production' : 'development'
      }))
	    .pipe(gulp.dest(paths.scripts.dest));
}

export const images = () => {
  return gulp.src(paths.images.src)
    .pipe(gulpif(PRODUCTION, imagemin()))
    .pipe(gulp.dest(paths.images.dest));
}

export const copy = () => {
  return gulp.src(paths.other.src)
    .pipe(gulp.dest(paths.other.dest));
    done();
}

export const clean = () => del(['dist']);

export const serve = (done) => {
  server.init({
    proxy: "http://localhost:8888"
  });
  done();
}

export const reload = (done) => {
  server.reload();
  done();
}

export const compress = () => {
  return gulp.src(paths.package.src)
  .pipe(replace('_themename', info.name))
  .pipe(zip(`${info.name}.zip`))
  .pipe(gulp.dest(paths.package.dest));
}

export const watch = () => {
  gulp.watch('src/assets/sass/**/*.scss', styles);
  gulp.watch('src/assets/js/**/*.js', gulp.series(scripts, reload));
  gulp.watch('**/*.php', reload);
  gulp.watch(paths.images.src, images, reload);
  gulp.watch(paths.other.src, copy, reload)
}

export const dev = gulp.series(clean, gulp.parallel(styles,scripts,images,copy), serve, watch);
export const build = gulp.series(clean, gulp.parallel(styles,scripts,images,copy));
export const bundle = gulp.series(build, compress);

// Default function
export default dev;
