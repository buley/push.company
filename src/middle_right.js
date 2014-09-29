define(['q', 'react', 'underscore', 'src/layout'], function(Q, React, _, layout) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      component = React.createClass({
        render: function() {
          var current = layout.current();
          return React.DOM.section({
            id: "middle-right-container",
            style: {
              top: (current.box_top + 20 + current.box_top_height) + "px",
              right: current.padding.right,
              height: (current.middle_right + 40) + "px",
              display: current.has_right ? "inline" : "none"
            }
          }, React.DOM.section({
            id: "middle-right"
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
