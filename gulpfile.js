var gulp = require('gulp');
var Elixir = require ('laravel-elixir');
require( 'elixir-jshint' );

if (Elixir.config.production) {
    // creates production build inside "bin" folder
    Elixir.config.publicPath = 'bin';
} else {
    // generate browserify source maps
    Elixir.config.js.browserify.options.debug = true;
}

var basePath = Elixir.config.publicPath;

Elixir(function (mix) {
	return mix
        .sass('src/sass/main.scss')
		.browserify('src/main.js', basePath + '/js/')
        .copy('src/img', basePath +'/img')
        .copy('src/index.html', basePath +'/index.html')
        // .jshint( ['src/**/*.js'], {
        //     lookup: true, // default is true
        //     esversion: 6,
        //     elision: true
        // })
		.browserSync([
			'src/*'
		]);
});
