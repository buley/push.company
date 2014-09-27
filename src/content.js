define(['q', 'react', 'underscore', 'src/layout'], function(Q, React, _, layout) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
      min = 0,
      first = true,
      instance,
      content,
      prev = {},
      padding = {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      },
      onResize = function(ctx) {
        var el = document.getElementById("content");
        content = {
          height: el ? el.offsetHeight : 0,
          width: el ? el.offsetWidth : 0
        };
        ctx.content = content;
        deferred.notify(ctx);
      },
      component = React.createClass({
        componentDidMount: function() {
            instance = this;
        },
        render: function() {
          var current = layout.current();
          if (current.right > height) {
            height = current.right;
          }
          return React.DOM.section({
            id: "content-container",
            style: {
              top: (padding.top + current.content_top + padding.bottom) + "px"
            }
          }, React.DOM.section({
            id: "content",
            style: {
              height: height + "px"
            }
          } ) );
        }
      });

  module.resolve(component);


  return {
    outgoing: function(interface) {
      interface(promise);
    },
    incoming: function(interface) {
      interface.then(null, null, function(state) {
        var json;
        if (first) {
          first = false;
          onResize(state);
        } else {
          if (!state.content) {
            state.content = content;
            deferred.notify(state);
          } else if (state.screen) {
            if (state.screen.updated !== prev.updated) {
              prev.updated = state.screen.updated;
              onResize(state);
            }
          } else {
            json = ads.json;
            if (json !== prev.json) {
              prev.json = json;
              onResize(state);
            }
          }
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
