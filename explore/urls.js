define(['q'], function(Q) {
  var deferred = Q.defer(),
      module = Q.defer(),
      incoming = function(interface) {
        interface.then(null, null, function(state) {
          if (!context) {
            context = _.extend({route: current}, {});
          } else {
            context = _.extend({route: current}, state);
          }
          deferred.notify(context);
        });
      },
      context,
      getQueryStringValues = function(qs) {
        var pair,
            vars = qs.split('&'),
            i,
            data = {};
        if (!!qs) {
          for (i = 0; i < vars.length; i++) {
              pair = vars[i].split('=');
              data[pair[0]] = pair[1];
          }          
        }
        return data;
      },
      current = {
        get: getQueryStringValues(window.location.search.substring(1)),
        hash: getQueryStringValues(decodeURIComponent(window.location.hash.substring(1)))
      };

  module.resolve();

  return {
    outgoing: function(interface) {
      interface(deferred.promise);
    },
    incoming: incoming,
    ready: module.promise.then.bind(module.promise)
  };
});
