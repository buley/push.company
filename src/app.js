requirejs.config({
    baseUrl: '../',
    paths: {
      'q': '/bower_components/q/q',
  		'dash': '/bower_components/dash/lib/dash.dev',
  		'mapbox': '/bower_components/mapbox.js/mapbox',
  		'underscore': '/bower_components/underscore/underscore',
  		'jquery': '/bower_components/jquery/dist/jquery',
  		'react': '/bower_components/react/react',
      'tween': '/bower_components/tween.js/src/Tween',
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
    },
    'tween': {
      exports: 'TWEEN'
    }
	}
});

requirejs(['q', 'react', 'underscore'], function(Q, React, _) {
	var module = Q.defer();
    require([ 'src/content', 'src/header', 'src/sidebar', 'src/footer', 'src/ads' ], function() {
      var state = {
            init: Date.now(),
            screen: {
              updated: Date.now()
            }
          },
          previous_state = '',
          deferred = Q.defer(),
          isReady = false,
          isRendered = false,
          doRender = function(ctx) {
            if (!isRendered) {
              React.renderComponent(
                container(state),
                document.getElementById('app'),
                function() {
                  module.resolve(component);
                }
              );
              isRendered = true;
            }
            if (!!component && !!component.isMounted && component.isMounted()) {
              component.replaceProps(ctx);
            } else {
              setTimeout(function() {
                doRender(ctx);
              }, 100);
            }
          },
          context = _.extend( {}, state),
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
          executeStateChange = function(ctx) {
              try {
                if ('function' === typeof ctx) {
                  ctx = ctx(JSON.parse(previous_state));
                }
              } catch(e) {
                ctx = {};
              }
              context = ctx;
              deferred.notify(ctx);
              doRender(ctx);
          },
          requestStateChange = function(change) {
            executeStateChange(change);
          },
          incoming = function(interface) {
            interface.then(null, null, function(change) {
              requestStateChange(change);
            });
          },
          ready = function() {
            isReady = true;
            requestStateChange(state);
          },
          interfaces = arguments,
          loaded = 1,
          components = [],
          onResize = function(e) {
            context.screen = {
              updated: new Date().getTime().toString()
            };
            requestStateChange(context);
          },
          onScroll = function(e) {
            context.scroll = {
              updated: new Date().getTime().toString()
            };
            requestStateChange(context);
          },
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

      window.addEventListener("resize", onResize);
      window.addEventListener("scroll", onScroll);


    });
	return module.promise;
});
