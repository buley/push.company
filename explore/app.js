requirejs.config({
    baseUrl: '../',
    paths: {
        'q': '/bower_components/q/q'
    }
});

requirejs(['q'], function(Q) {
	console.log("Q",Q);
});
