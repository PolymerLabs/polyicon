/*
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

'use strict';

let del = require('del');
let gulp = require('gulp');
let $ = require('gulp-load-plugins')();
let polyBuild = require('polybuild');
let merge = require('merge-stream');
let runSequence = require('run-sequence');

// function minifyHtml() {
//   return $.minifyHtml({quotes: true, empty: true, spare: true});
// }

// function uglifyJS() {
//   return $.uglify({preserveComments: 'some'});
// }

function polybuild() {
  return polyBuild({maximumCrush: true, suffix: ''});
}

function license() {
  return $.license('BSD-3-Clause', {
    organization: 'The Polymer Project Authors. All rights reserved.',
    tiny: true
  });
}

gulp.task('clean', function() {
  return del(['dist']);
});

gulp.task('copy', function() {
  let docs = gulp.src(['*.html'], {base: '.'})
    .pipe(gulp.dest('dist'));

  let gae = gulp.src([
      //'{templates,lib,tests}/**/*'
      'app.yaml'
    ])
    .pipe(gulp.dest('dist'));

  let bower = gulp.src([
      'bower_components/webcomponentsjs/webcomponents-lite*.js'
    ], {base: '.'})
    .pipe(gulp.dest('dist'));

  return merge(docs, gae, bower);
});

gulp.task('vulcanize', function() {
  return gulp.src('elements/elements.html')
    // .pipe($.vulcanize({
    //   inlineScripts:true,
    //   inlineCss: false,
    //   stripComments: true
    // }))
    // .pipe($.crisper({scriptInHead: true}))
    // .pipe($.if('*.html', minifyHtml())) // Minify html output
    // .pipe($.if('*.js', uglifyJS())) // Minify js output
    .pipe(polybuild())
    .pipe($.if('*.js', license()))
    .pipe(gulp.dest('dist/elements'));
});

gulp.task('default', ['clean'], function(done) {
  runSequence(['vulcanize', 'copy'], done);
});
