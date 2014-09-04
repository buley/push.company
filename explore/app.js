requirejs.config({
    baseUrl: '../',
    paths: {
    'q': '/bower_components/q/q',
		'dash': '/bower_components/dash/lib/dash',
		'mapbox': '/bower_components/mapbox.js/mapbox',
		'underscore': '/bower_components/underscore/underscore',
		'jquery': '/bower_components/jquery/dist/jquery',
		'react': '/bower_components/react/react'
    },
	shim: {
		'q': {
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
		},
		'react': {
			exports: 'React'
		}
	}
});

requirejs(['q', 'react'], function(Q, React) {
	var module = Q.defer();
    require(['explore/presence', 'explore/mapper', 'explore/location'], function() {
      var state = { init: Date.now(), timestamp: Date.now() },
          previous_state = '',
          deferred = Q.defer(),
          promise = deferred.promise,
          container = React.createClass({
            componentWillMount: function() {
              component = this;
            },
            render: function() {
              var that = this;
              return React.DOM.div.apply(this, components.map(function(el) {
                if (!!el) {
                  return el(that.props);
                }
              }));
            }
          }),
          component,
          state_queue = [],
          doStateChange = function() {
            if (0 === state_queue.length) {
              return;
            }
            executeStateChange();
            if (state_queue.length > 0) {
              setTimeout(function() {
                doStateChange();
              }, 100);
            }
          },
          executeStateChange = function() {
            if (!!component && !!component.isMounted && component.isMounted()) {
              var next_state = state_queue.shift(),
                  ctx = 'function' === typeof next_state ? next_state(JSON.parse(previous_state)) : JSON.parse(next_state);
              component.replaceProps(ctx);
              if (next_state !== previous_state) {
                previous_state = next_state;
                deferred.notify(ctx);
              }
            }
          },
          requestStateChange = function(change) {
            state_queue.push(JSON.stringify(change));
            setTimeout(function() {
              doStateChange();
            }, 100);
          },
          internal = Q.defer(),
          incoming = function(interface) {
            interface.then(null, null, function(change) {
              requestStateChange(change);
            });
          },
          ready = function() {
            React.renderComponent(
              container.apply(this, [state]),
              document.getElementById('explore'),
              function() {
                module.resolve(component);
              }
            );
          },
          interfaces = arguments,
          loaded = 1,
          components = [null],
          forEachHandler = function(interface) {
            var readyHandler = function(comp) {
                  interface.incoming(promise);
                  interface.outgoing(incoming);
                  if (!!comp) {
                    components.push(comp);
                  }
                  if (loaded === interfaces.length) {
                    ready();
                  } else {
                    loaded = loaded + 1;
                  }
                };
            interface.ready(readyHandler);
          };

      Array.prototype.forEach.call(interfaces, forEachHandler);

      incoming(internal.promise);

    });
	return module.promise;
});
