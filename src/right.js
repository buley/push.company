define(['q', 'react', 'underscore', 'src/layout'], function(Q, React, _, layout) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      component = React.createClass({
        render: function() {
          var current = layout.current();
          return React.DOM.section({
            id: "right-container",
            style: {
              top: current.content_top - 20,
              height: (current.sidebar + current.top_right_height + current.bottom_right_height) + "px",
              display: current.has_right ? 'inline' : 'none'
            }
          }, React.DOM.section({
            id: "right"
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
