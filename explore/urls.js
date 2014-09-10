define(['q'], function(Q) {
  var deferred = Q.defer(),
      module = Q.defer(),
      previous,
      incoming = function(interface) {
        interface.then(null, null, function(state) {
          if (!state.route) {
            deferred.notify(_.extend({route: current}, state));
          } else if (JSON.stringify(current) !== JSON.stringify(state.route)) {
            current = state.route;
            updateUrl(current.get, current.hash);
          }
        });
      },
      context,
      getQuery = function(obj, prefix) {
        var x = 0,
            attr,
            str = [];
        for (attr in obj) {
          if (obj.hasOwnProperty(attr)) {
            str.push([
                attr,
                obj[attr]
            ].join("="));
          }
        }
        if (0 === str.length) {
          return "";
        } else {
          return prefix + encodeURIComponent(str.join("&"));
        }
      },
      updateUrl = function(gets, hashes) {
        history.replaceState(
          {},
          window.title,
          [
            window.location.protocol,
            "//",
            window.location.host,
            window.location.pathname,
            getQuery(gets, "?"),
            getQuery(hashes, "#")
          ].join("")
        )
      },
      getQueryStringValues = function(qs) {
        var pair,
            vars = qs.split('&'),
            i,
            val,
            data = {};
        if (!!qs) {
          for (i = 0; i < vars.length; i++) {
              pair = vars[i].split('=');
              val = parseFloat(pair[1], 10);
              if (true === isNaN(val)) {
                val = pair[1];
              }
              data[pair[0]] = val;
          }
        }
        return data;
      },
      current = {},
      resetState = function() {
        current = {
          get: getQueryStringValues(window.location.search.substring(1)),
          hash: getQueryStringValues(decodeURIComponent(window.location.hash.substring(1)))
        }
        context = _.extend({route: current}, context);
        deferred.notify(context);
      };


  window.addEventListener( 'popstate', resetState );
  resetState();

  module.resolve();

  return {
    outgoing: function(interface) {
      interface(deferred.promise);
    },
    incoming: incoming,
    ready: module.promise.then.bind(module.promise)
  };
});
