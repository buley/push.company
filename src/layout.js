define([], function() {
  return {
    current: function() {
      var padding = {
            top: 20,
            bottom: 20,
            left: 20,
            right: 20
          },
          middle_left,
          middle_right,
          top_left,
          bottom_left,
          top_right,
          bottom_right,
          min_width = 960,
          min_middle = 420,
          min_diff_r = 0,
          min_diff_l = 0,
          min_top = 200,
          min_bottom = 400,
          y = window.scrollY,
          total_width = document.body.offsetWidth || 0,
          has_ads = true,
          has_left = total_width > 1200 ? true : false,
          has_right = total_width > 600 ? true : false,
          fixed_header_height = 44,
          header = document.getElementById("header"),
          header_height = header ? header.offsetHeight : 0,
          footer = document.getElementById("footer-container"),
          footer_height = footer ? footer.offsetHeight : 0,
          top_el = document.getElementById("ads-banner-top") || {},
          top_height = top_el.offsetHeight ? top_el.offsetHeight : 0,
          top_width = top_el.offsetWidth ? top_el.offsetWidth : 0,
          content = document.getElementById("content-container"),
          height = content ? content.offsetHeight : 0,
          width,
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
          left_el = document.getElementById("left-container") || {},
          left_height = left_el.offsetHeight ? left_el.offsetHeight : 0,
          left_width = left_el.offsetWidth ? left_el.offsetWidth : 0,
          right_el = document.getElementById("right-container") || {},
          right_height = right_el.offsetHeight ? right_el.offsetHeight : 0,
          right_width = right_el.offsetWidth ? right_el.offsetWidth : 0,
          top_left_el = document.getElementById("top-left-container"),
          top_left_height = top_left_el ? top_left_el.offsetHeight : 0,
          top_left_width = top_left_el ? top_left_el.offsetHeight : 0,
          bottom_left_el = document.getElementById("bottom-left-container"),
          bottom_left_height = bottom_left_el ? bottom_left_el.offsetHeight : 0,
          bottom_left_width = bottom_left_el ? bottom_left_el.offsetHeight : 0,
          top_right_el = document.getElementById("top-right-container"),
          top_right_height = top_right_el ? top_right_el.offsetHeight : 0,
          top_right_width = top_right_el ? top_right_el.offsetHeight : 0,
          bottom_right_el = document.getElementById("bottom-right-container"),
          bottom_right_height = bottom_right_el ? bottom_right_el.offsetHeight : 0,
          bottom_right_width = bottom_right_el ? bottom_right_el.offsetHeight : 0,
          total_width_padding = total_width - top_width,
          total_width_padding_bottom = total_width - bottom_width,
          bottom_width_base = Math.floor(total_width_padding_bottom/2),
          top_width_base = Math.floor(total_width_padding/2),
          content_top = (header_height + padding.top + (top_height > 0 ? padding.top + top_height + padding.bottom : 0 ) ),
          box_top = (header_height + padding.top + (top_height > 0 ? padding.top + top_height + padding.bottom : 0 ) ),
          left_box_top,
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

      width = min_width;

      if ((width + right_width + left_width) > total_width) {
        width = total_width - right_width - left_width;
      }

      /* Top */

      min_diff_r = 0;
      min_diff_l = 0;

      if (top_right_height < min_top) {
        min_diff_r = min_top - top_right_height;
      }

      if (top_left_height < min_top) {
        min_diff_l = min_top - top_left_height;
      }

      top_right_height += min_diff_r;
      top_left_height += min_diff_l;

      left_box_top = box_top + top_left_height;
      box_top += top_right_height;

      sidebar += min_diff_r;
      left_sidebar += min_diff_l;

      /* Middle */

      middle_right = sidebar - 120 - box_top_height - box_bottom_height;
      middle_left = left_sidebar - 120 - left_box_top_height - left_box_bottom_height;

      min_diff_r = 0;
      min_diff_l = 0;

      if (middle_right < min_middle) {
        min_diff_r = min_middle - middle_right;
      }
      if (middle_left < min_middle) {
        min_diff_l = min_middle - middle_left;
      }

      middle_right += min_diff_r;
      sidebar += min_diff_r;

      middle_left += min_diff_l;
      left_sidebar += min_diff_l;

      /* Bottom */

      min_diff_r = 0;
      min_diff_l = 0;

      if (top_right_height < min_bottom) {
        min_diff_r = min_bottom - bottom_right_height;
      }

      if (top_left_height < min_bottom) {
        min_diff_l = min_bottom - bottom_left_height;
      }

      bottom_right_height += min_diff_r;

      bottom_left_height += min_diff_l;


      if (sidebar > height) {
        height = sidebar;
      }
      if (left_sidebar > height) {
        height = left_sidebar;
      }

      return {
        y: y,
        padding: padding,
        has_ads: has_ads,
        has_left: has_left,
        has_right: has_right,
        header: header,
        header_height: header_height,
        fixed_header_height: fixed_header_height,
        footer: footer,
        footer_height: footer_height,
        top_el: top_el,
        top_height: top_height,
        top_width: top_width,
        content: content,
        height: height,
        width: width,
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
        left_box_top: left_box_top,
        content_top: content_top,
        sidebar: sidebar,
        left_sidebar: left_sidebar,
        content_top: content_top,
        total: total,
        right_height: right_height,
        left_width: left_width,
        right_width: right_width,
        left_height: left_height,
        middle_left: middle_left,
        middle_right: middle_right,
        top_right_height: top_right_height,
        top_left_height: top_left_height,
        top_right_width: top_right_width,
        top_left_width: top_left_width,
        bottom_right_height: bottom_right_height,
        bottom_left_height: bottom_left_height,
        bottom_right_width: bottom_right_width,
        bottom_left_width: bottom_left_width
      };
    }
  }
});
