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
              top: (current.right_box_top + current.right_box_top_height + current.middle_right + 40 + current.right_box_bottom_height + 40 + 20) + "px",
              height: (current.bottom_right_height + 40) + "px",
              right: current.padding.right,
              display: current.has_right ? "inline" : "none"
            }
          }, React.DOM.section({
            id: "bottom-right"
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
