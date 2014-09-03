requirejs.config({
    baseUrl: '../',
    paths: {
        'q': '/bower_components/q/q',
		'dash': '/bower_components/dash/lib/dash',
		'mapbox': '/bower_components/mapbox.js/mapbox',
		'underscore': '/bower_components/underscore/underscore',
		'jquery': '/bower_components/jquery/dist/jquery.js'
    },
	shim: {
		'Q': {
			exports: 'Q'
		},
		'dash': {
			exports: 'dash'
		},
		'mapbox': {
			exports: 'L'
		},
		'underscore': {
			exports: '_'
		},
		'jquery': {
			exports: 'jQuery'
		}
	}
});

requirejs(['q', 'jquery', 'underscore', 'dash', 'mapbox'], function(Q, $, _, dash, mapbox) {
	console.log("AMD",arguments);
});
