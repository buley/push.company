define(['q', 'react', 'underscore', 'src/layout'], function(Q, React, _, layout) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      component = React.createClass({
        render: function() {
          var current = layout.current();
          return React.DOM.section({
            id: "left-container",
            style: {
              top: (current.box_top - padding.top) + "px",
              height: current.left_sidebar + "px",
              display: current.has_left ? "inline" : "none"
            }
          }, React.DOM.section({
            id: "left"
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
