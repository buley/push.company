define(['q', 'underscore'], function(Q, _) {
  var deferred = Q.defer(),
      module = Q.defer(),
      previous,
      current_str,
      context = {},
      incoming = function(interface) {
        interface.then(null, null, function(state) {
          context = state;
          if (!state.route) {
            deferred.notify(_.extend(state, {route: current}));
          } else {
            if (current_str !== JSON.stringify(state.route)) {
              current = context.route;
              current_str = JSON.stringify(context.route);
              updateUrl(current.get, current.hash);
            }
          }
        });
      },
      current = {},
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
      resetState = function(e) {
        current = {
          get: getQueryStringValues(window.location.search.substring(1)),
          hash: getQueryStringValues(decodeURIComponent(window.location.hash.substring(1)))
        };
        if (null !== e) {
          deferred.notify(_.extend(context, {route: current}));
        }
      };


  window.addEventListener( 'popstate', resetState );
  resetState(null);

  module.resolve();

  return {
    outgoing: function(interface) {
      interface(deferred.promise);
    },
    incoming: incoming,
    ready: module.promise.then.bind(module.promise)
  };
});
