requirejs.config({
    baseUrl: '../',
    paths: {
        'q': '/bower_components/q/q.js'
    }
});

requirejs(['q'], function(Q) {
	console.log("Q",Q);
});
