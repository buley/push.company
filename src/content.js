define(['q', 'react', 'underscore', 'src/layout'], function(Q, React, _, layout) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      component = React.createClass({
        render: function() {
          var current = layout.current();
          return React.DOM.section({
            id: "content-container",
            style: {
              top: (current.content_top) + "px",
              right: current.right_width + "px",
              left: current.left_width + "px",
              "max-height": current.height + "px"
            }
          }, React.DOM.section({
            id: "content",
            style: {
              "max-width": current.width + "px"
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
