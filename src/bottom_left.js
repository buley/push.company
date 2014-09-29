define(['q', 'react', 'underscore', 'src/layout'], function(Q, React, _, layout) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      component = React.createClass({
        render: function() {
          var current = layout.current();
          return React.DOM.section({
            id: "bottom-left-container",
            style: {
              bottom: (current.box_bottom + 20 + current.left_box_bottom_height) + "px",
              height: (current.bottom_left + 40) + "px",
              left: current.padding.left,
              display: current.has_left ? "inline" : "none"
            }
          }, React.DOM.section({
            id: "bottom-left"
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
