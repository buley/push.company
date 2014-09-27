define(['q', 'react', 'underscore', 'src/layout'], function(Q, React, _, layout) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      component = React.createClass({
        render: function() {
          var current = layout.current();
          return React.DOM.section({
            id: "footer-container",
            style: {
              "top": (current.content_top + current.height + (current.bottom_height > 0 ? current.bottom_height + padding.top + padding.bottom : 0) ) + "px",
            }
          }, React.DOM.section({
            id: "footer"
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
