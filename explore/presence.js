define(['q', 'react', 'dash', 'jquery', 'underscore', 'explore/trig' ], function(Q, React, dash, $, _, trig) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context = {},
      current,
      previous,
      render = function() {
        return React.DOM.div(null, (this.props.init - this.props.timestamp).toString());
      },
      component = React.createClass({
        componentDidMount: function() {
          var that = this,
              install = function(cb) {
                addDatabases(function() {
                  addStores(function() {
                    addIndexes(function() {
                      if ('function' === typeof cb) {
                        cb();
                      }
                    } );
                  } );
                } );
              };

          dash.get.store({"database": "push", "store": "Places1", "store_key_path": "Id"})(function(ctx) {
            ctx.index = "Name";
            ctx.index_key_path = "Name";
            ctx.index_multi_entry = false; //same as default
            ctx.index_unique = false; //same as default
            dash.get.index(ctx)(function(c) {
              ctx.index = 'Area';
              ctx.index_key_path = 'area';
              dash.get.index(c)(function(z) {
                console.log('installed');
              });
            });
          }, function(d) { console.log("Not Added", d); } );

        },
        render: render
      });

  module.resolve();

  return {
    outgoing: function(interface) {
      interface(promise);
    },
    incoming: function(interface) {
      interface.then(null, null, function(state) {
        var distance,
            notify = false,
            prev;
        if (JSON.stringify(current) !== JSON.stringify(state.location)) {
          if (!!current) {
            notify = true;
            distance = trig.distance(current, state.location);
            prev = current;
            prev.duration = Date.now() - prev.arrived;
            prev.distance = Infinity === distance ? null : distance;
          }
          current = state.location;
          current.arrived = Date.now();
          context = _.extend(state, {location: current, previous_location: prev});
          if (true === notify) {
            deferred.notify(context);
          }
        } else {
          context = state;
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
