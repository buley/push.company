define(['q', 'underscore'], function(Q, _) {
  var deferred = Q.defer(),
      module = Q.defer(),
      previous,
      incoming = function(interface) {
        interface.then(null, null, function(state) {
          if (!state.route) {
            deferred.notify(_.extend(state, {route: current});
          } else {
            if (JSON.stringify(current) !== JSON.stringify(state.route)) {
              current = context.route;
              updateUrl(current.get, current.hash);
            }
          }
        });
      },
      current = {},
      context = {},
      getQuery = function(obj, prefix, encode) {
        var x = 0,
            attr,
            str = [];
        encode = encode || false;
        for (attr in obj) {
          if (obj.hasOwnProperty(attr)) {
            str.push([
                attr,
                obj[attr]
            ].join(encode ? "%3D" : "="));
          }
        }
        if (0 === str.length) {
          return "";
        } else {
          return prefix + str.join(encode ? "%26" : "&");
        }
      },
      updateUrl = function(gets, hashes) {
        history.replaceState(
          context,
          window.title,
          [
            window.location.protocol,
            "//",
            window.location.host,
            window.location.pathname,
            getQuery(gets, "?"),
            getQuery(hashes, "#", true)
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
      resetState = function() {
        current = {
          get: getQueryStringValues(window.location.search.substring(1)),
          hash: getQueryStringValues(decodeURIComponent(window.location.hash.substring(1)))
        };
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
