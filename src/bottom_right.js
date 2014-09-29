define(['q', 'react', 'underscore', 'src/layout'], function(Q, React, _, layout) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      component = React.createClass({
        render: function() {
          var current = layout.current();
          return React.DOM.section({
            id: "bottom-right-container",
            style: {
              top: (current.bottom_right_top) + "px",
              "max-height": current.bottom_right_height,
              right: current.padding.right,
              display: current.has_right ? "inline" : "none"
            }
          }, React.DOM.section({
            id: "bottom-right",
            style: {
              "min-height": current.bottom_right_height + "px"
            }
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
