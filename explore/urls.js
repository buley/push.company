define(['q'], function(Q) {
  var deferred = Q.defer(),
      module = Q.defer(),
      previous,
      incoming = function(interface) {
        interface.then(null, null, function(state) {
          if (!state.route) {
            deferred.notify(_.extend({route: current}, state));
          } else if (JSON.stringify(current) !== JSON.stringify(state.route)) {
            updateUrl(current.get, current.hash);
            current = state.route;
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
        console.log("UPDATE", [
          window.location.protocol,
          "//",
          window.location.host,
          window.location.pathname,
          getQuery(gets),
          getQuery(hashes)
        ].join(""))
        history.replaceState(
          [
            window.location.protocol,
            "//",
            window.location.host,
            window.location.pathname,
            getQuery(gets, "?"),
            getQuery(hashes, "#")
          ].join(""),
          {}
        )
      },
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
