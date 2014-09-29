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
              "max-width": current.width + "px",
              "min-height": current.height + "px"
            }
          }, React.DOM.section({ id: "content-header"},
            React.DOM.div({id: "content-header-pubdate"}, React.DOM.span({}, "August 20, 2014")),
            React.DOM.div({id: "content-header-title"}, React.DOM.h1({}, "Biltong tail spare ribs turkey prosciutto hamburger pig sausage")),
            React.DOM.div({id: "content-header-description"}, React.DOM.span({}, "Bacon ipsum dolor sit amet capicola shoulder meatball, bacon tenderloin salami ham short loin frankfurter rump.")),
            React.DOM.div({id: "content-header-byline"}, React.DOM.span({}, "Andouille Meatloaf"), React.DOM.span({}, ", Staff Writer"))
          ),
            React.DOM.section({id: "content-body"},
              React.DOM.p({}, "Venison pork pork chop frankfurter tongue tail ball tip. Leberkas pancetta hamburger ground round brisket tenderloin."),
              React.DOM.p({}, "Strip steak pig drumstick bacon. Boudin chicken jowl short loin, filet mignon swine capicola pancetta ham hock."),
              React.DOM.p({}, "Ribeye capicola shankle frankfurter turducken salami strip steak kevin rump venison biltong meatloaf porchetta short loin. Capicola ground round sirloin filet mignon tail shank meatball kielbasa kevin sausage hamburger boudin cow."),
              React.DOM.p({}, "Brisket ham hock jowl flank shankle corned beef.")
            )
          ) );
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
