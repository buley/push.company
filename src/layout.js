define([], function() {
  return {
    current: function() {
      var padding = {
            top: 20,
            bottom: 20,
            left: 20,
            right: 20
          },
          getLogo = function(y) {
            var large = {
              width: 220,
              height: 68
            }, small = {
              width: 142,
              height: 44
            };
            if (y > 0) {
              return small;
            }
            return large;
          },
          y = window.scrollY,
          has_ads = false,
          has_left = false,
          has_right = false,
          header = document.getElementById("header"),
          header_height = header ? header.offsetHeight : 0,
          footer = document.getElementById("footer-container"),
          footer_height = footer ? footer.offsetHeight : 0,
          top_el = document.getElementById("ads-banner-top") || {},
          top_height = top_el.offsetHeight ? top_el.offsetHeight : 0,
          top_width = top_el.offsetWidth ? top_el.offsetWidth : 0,
          content = document.getElementById("content-container"),
          height = content ? content.offsetHeight : 0,
          bottom_el = document.getElementById("ads-banner-bottom") || {},
          bottom_height = bottom_el.offsetHeight ? bottom_el.offsetHeight : 0,
          bottom_width = bottom_el.offsetWidth ? bottom_el.offsetWidth : 0,
          box_bottom_el = document.getElementById("ads-box-bottom") || {},
          box_bottom_height = box_bottom_el.offsetHeight ? box_bottom_el.offsetHeight : 0,
          box_bottom_width = box_bottom_el.offsetWidth ? box_bottom_el.offsetWidth : 0,
          box_top_el = document.getElementById("ads-box-top") || {},
          box_top_height = box_top_el.offsetHeight ? box_top_el.offsetHeight : 0,
          box_top_width = box_top_el.offsetWidth ? box_top_el.offsetWidth : 0,
          left_box_bottom_el = document.getElementById("ads-box-bottom-left") || {},
          left_box_bottom_height = left_box_bottom_el.offsetHeight ? left_box_bottom_el.offsetHeight : 0,
          left_box_bottom_width = left_box_bottom_el.offsetWidth ? left_box_bottom_el.offsetWidth : 0,
          left_box_top_el = document.getElementById("ads-box-top-left") || {},
          left_box_top_height = left_box_top_el.offsetHeight ? left_box_top_el.offsetHeight : 0,
          left_box_top_width = left_box_top_el.offsetWidth ? left_box_top_el.offsetWidth : 0,
          total_width = document.body.offsetWidth || 0,
          total_width_padding = total_width - top_width,
          total_width_padding_bottom = total_width - bottom_width,
          bottom_width_base = Math.floor(total_width_padding_bottom/2),
          top_width_base = Math.floor(total_width_padding/2),
          box_top = (header_height + padding.top + (top_height > 0 ? padding.top + top_height + padding.bottom : 0 ) ),
          sidebar = padding.top + box_top_height + padding.bottom + padding.top + box_bottom_height + padding.bottom,
          left_sidebar = padding.top + left_box_top_height + padding.bottom + padding.top + left_box_bottom_height + padding.bottom,
          content_top = header_height + (top_height > 0 ? padding.top + top_height + padding.bottom : 0),
          total = header_height + padding.top + top_height + padding.bottom + height + padding.top + bottom_height + padding.bottom + footer_height;

      if (sidebar > height) {
        height = sidebar;
      }
      if (left_sidebar > height) {
        height = left_sidebar;
      }
      if (height > left_sidebar) {
        left_sidebar = height;
      }
      if (height > sidebar) {
        sidebar = height;
      }
      if (y > total) {
        y = total;
      } else if (y < 0) {
        y = 0;
      }

      return {
        y: y,
        has_ads: has_ads,
        has_left: has_left,
        has_right: has_right,
        header: header,
        header_height: header_height,
        footer: footer,
        footer_height: footer_height,
        top_el: top_el,
        top_height: top_height,
        top_width: top_width,
        content: content,
        height: height,
        bottom_el: bottom_el,
        bottom_height: bottom_height,
        bottom_width: bottom_width,
        box_bottom_el: box_bottom_el,
        box_bottom_height: box_bottom_height,
        box_bottom_width: box_bottom_width,
        box_top_el: box_top_el,
        box_top_height: box_top_height,
        box_top_width: box_top_width,
        left_box_bottom_el: left_box_bottom_el,
        left_box_bottom_height: left_box_bottom_height,
        left_box_bottom_width: left_box_bottom_width,
        left_box_top_el: left_box_top_el,
        left_box_top_height: left_box_top_height,
        left_box_top_width: left_box_top_width,
        total_width: total_width,
        total_width_padding: total_width_padding,
        total_width_padding_bottom: total_width_padding_bottom,
        bottom_width_base: bottom_width_base,
        top_width_base: top_width_base,
        box_top: box_top,
        sidebar: sidebar,
        left_sidebar: left_sidebar,
        content_top: content_top,
        total: total,
        getLogo: getLogo
      };
    }
  }
});
