var SystemBuilder = require('systemjs-builder');
var builder = new SystemBuilder();

builder.loadConfig('../systemjs.config.js')
  .then(function(){
	  return builder.bundle(
          // 'js - [js/**/*] - [js/*]', // build app and remove the app code - this leaves only 3rd party dependencies
          // 'js/libs/libs-bundle.js');
        '../app/vendor.ts - [rxjs]',
        '../libs/angular2.min.js', {minify: true, sourceMap:true}
    );
  })
  .then(function(){
	  console.log('library bundles built successfully!');
  });