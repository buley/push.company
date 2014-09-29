define(['q', 'react', 'underscore', 'src/layout'], function(Q, React, _, layout) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      component = React.createClass({
        render: function() {
          var current = layout.current();
          return React.DOM.section({
            id: "top-left-container",
            style: {
              top: (current.content_top) + "px",
              "max-height": current.top_left_height,
              left: current.padding.left,
              display: current.has_left ? "inline" : "none"
            }
          }, React.DOM.section({
            id: "top-left",
            min-height: current.top_left_height + "px"
          } ) );
        }
      });

  module.resolve(component);

  return {
    outgoing: function(interface) {
      interface(promise);
    },
    ready: module.promise.then.bind(module.promise)
  };
});
