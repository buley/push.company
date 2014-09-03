requirejs.config({
    baseUrl: '../',
    paths: {
        'q': '/bower_components/q/q',
		'dash': '/bower_components/dash/lib/dash',
		'mapbox': '/bower_components/mapbox.js/mapbox',
		'underscore': '/bower_components/underscore/underscore'
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
		}
	}
});

requirejs(['q', 'dash', 'mapbox'], function(Q, dash, mapbox) {
	console.log("AMD",arguments);
});
