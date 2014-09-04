define(['q', 'react', 'dash', 'jquery' ], function(Q, React, dash, $) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context = {},
      render = function() {
        return React.DOM.div(null, (this.props.init - this.props.timestamp).toString());
      },
      component = React.createClass({
        componentDidMount: function() {
          var that = this;
          dash.get.store({"database": "push", "store": "Places1", "store_key_path": "Id"})(function(ctx) {

              ctx.index = "Name";
              ctx.index_key_path = "Name";
              ctx.index_multi_entry = false; //same as default
              ctx.index_unique = false; //same as default

              dash.get.index(ctx)(function(c) {
                ctx.index = 'Area';
                ctx.index_key_path = 'area';
                dash.get.index(c)(function(z) {

                  $.ajax( {
                    method: 'GET',
                    dataType: 'json',
                    url: 'http://23.236.54.41/?latitude=' + that.props.location.latitude + '&longitude=' + that.props.location.longitude + '&max=1000',
                    success: function(data) {
                      var x,
                          xlen = data.Data.length,
                          item;
                      for(x = 0; x < xlen; x += 1) {
                        item = data.Data[x];
                        var z, zlen = item.Places.length;
                        for (z = 0; z < zlen; z += 1) {
                          dash.add.entry({"database": "push", "store": "Places1", "data": item.Places[z]})(function(d) { console.log("Added", d); })
                        }
                        L.marker( L.latLng(item.Location.Latitude, item.Location.Longitude)).addTo(map);
                      }
                    }
                  } );
                });
            });

        }, function(d) { console.log("Not Added", d); })

        },
        render: render
      });
  module.resolve(component);

  return {
    outgoing: function(interface) {
      interface(promise);
    },
    incoming: function(interface) {
      interface.then(null, null, function(state) {
        context = state;
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
