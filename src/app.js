requirejs.config({
    baseUrl: '../',
    paths: {
      'q': '/bower_components/q/q',
  		'dash': '/bower_components/dash/lib/dash.dev',
  		'mapbox': '/bower_components/mapbox.js/mapbox',
  		'underscore': '/bower_components/underscore/underscore',
  		'jquery': '/bower_components/jquery/dist/jquery',
  		'react': '/bower_components/react/react',
      'xdate': '/bower_components/xdate/src/xdate',
      'cache': '/bower_components/dash/behaviors/cache.dev',
      'changes': '/bower_components/dash/behaviors/changes.dev',
      'collect': '/bower_components/dash/behaviors/collect.dev',
      'live': '/bower_components/dash/behaviors/live.dev',
      'map': '/bower_components/dash/behaviors/map.dev',
      'mapreduce': '/bower_components/dash/behaviors/mapreduce.dev',
      'match': '/bower_components/dash/behaviors/match.dev',
      'shorthand': '/bower_components/dash/behaviors/shorthand.dev',
      'stats': '/bower_components/dash/behaviors/stats.dev'
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
    'xdate': {
      exports: 'XDate'
    },
		'react': {
			exports: 'React'
		},
    'cache': {
      exports: 'dashCache'
    },
    'changes': {
      exports: 'dashChanges'
    },
    'collect': {
      exports: 'dashCollect'
    },
    'live': {
      exports: 'dashLive'
    },
    'map': {
      exports: 'dashMap'
    },
    'mapreduce': {
      exports: 'dashMapReduce'
    },
    'match': {
      exports: 'dashMatch'
    },
    'shorthand': {
      exports: 'dashShorthand'
    },
    'stats': {
      exports: 'dashStats'
    }
	}
});

requirejs(['q', 'react'], function(Q, React) {
	var module = Q.defer();
    require(['src/header', 'src/presence', 'src/mapper', 'src/location', 'src/urls' ], function() {
      var state = {},
          previous_state = '',
          deferred = Q.defer(),
          promise = deferred.promise,
          container = React.createClass({
            componentWillMount: function() {
              component = this;
            },
            render: function() {
              var that = this,
                  args = components.map(function(el) {
                    if (!!el) {
                      return el(that.props);
                    }
                  });
              args.unshift(null);
              return React.DOM.div.apply(this, args);
            }
          }),
          component,
          state_queue = [],
          doStateChange = function() {
            if (0 === state_queue.length) {
              return;
            }
            executeStateChange();
          },
          executeStateChange = function() {
            if (!!component && !!component.isMounted && component.isMounted()) {
              var next_state = state_queue.shift() || "",
                  ctx;
              try {
                if ('function' === typeof next_state) {
                  ctx = next_state(previous_state);
                } else {
                  ctx = next_state;
                }
              } catch(e) {
                ctx = {};
              }
              if (JSON.stringify(next_state) !== previous_state) {
                previous_state = JSON.stringify(next_state);
                deferred.notify(ctx);
              }
              if (0 === state_queue.length) {
                component.replaceProps(ctx);
              } else {
                doStateChange();
              }
            } else {
              setTimeout(function() {
                doStateChange();
              }, 100);
            }
          },
          requestStateChange = function(change) {
            state_queue.push(change);
            doStateChange();
          },
          incoming = function(interface) {
            interface.then(null, null, function(change) {
              requestStateChange(change);
            });
          },
          ready = function() {
            React.renderComponent(
              container(state),
              document.getElementById('app'),
              function() {
                module.resolve(component);
              }
            );
          },
          interfaces = arguments,
          loaded = 1,
          components = [],
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
            if (!!interface && !!interface.ready) {
              interface.ready(readyHandler);
            } else {
              loaded = loaded + 1;
            }
          };

      Array.prototype.forEach.call(interfaces, forEachHandler);

      requestStateChange({ init: Date.now() });

    });
	return module.promise;
});
