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
              top: (current.content_top - 20) + "px",
              height: (current.left_sidebar + current.top_left_height + current.bottom_left_height) + "px",
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
