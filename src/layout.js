define([], function() {
  return {
    current: function() {
      var image_aspect = 1.618,
          image_width,
          padding = {
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
          bottom_left_top,
          bottom_right_top,
          min_width = 960,
          min_middle = 420,
          min_diff_r = 0,
          min_diff_l = 0,
          min_top_right = 200,
          min_top_left = 120,
          min_bottom_left = 220,
          min_bottom_right = 160,
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
          header_ad_el = document.getElementById("ads-box-header") || {},
          header_ad_height = header_ad_el.offsetHeight ? header_ad_el.offsetHeight : 0,
          header_ad_width = header_ad_el.offsetWidth ? header_ad_el.offsetWidth : 0,
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
          box_top = (header_height + padding.top + (top_height > 0 ? padding.top + top_height + padding.bottom : 0 ) ),
          left_box_top = (header_height + padding.top + (top_height > 0 ? padding.top + top_height + padding.bottom : 0 ) ),
          sidebar = padding.top + box_top_height + box_bottom_height,
          left_sidebar = padding.top + left_box_top_height + left_box_bottom_height,
          content_top = header_height + (top_height > 0 ? padding.top + top_height + padding.bottom : 0),
          total = header_height + padding.top + top_height + padding.bottom + height + padding.top + bottom_height + padding.bottom + footer_height;

      if (sidebar > height) {
        height = 0 + sidebar;
      }
      if (left_sidebar > height) {
        height = 0 + left_sidebar;
      }

      if (height > left_sidebar) {
        left_sidebar = 0 + height;
      }

      if (height > sidebar) {
        sidebar = 0 + height;
      }

      if (y > total) {
        y = 0 + total;
      } else if (y < 0) {
        y = 0;
      }

      /* Width */

      width = 0 + min_width;

      if ((width + right_width + left_width) > total_width) {
        width = 0 + total_width - right_width - left_width;
      }

      if (width > min_width) {
        console.log("BIG ENOUGH",width,total_width, right_width, left_width);
      }

      image_width = 0 + width - padding.left - padding.right;

      /* Height */

      if (bottom_left_height < min_bottom_left) {
        bottom_left_height = 0 + min_bottom_left;
      }

      if (bottom_right_height < min_bottom_right) {
        bottom_right_height = 0 + min_bottom_right;
      }

      /* Top */

      if (top_right_height < min_top_right) {
        top_right_height = 0 + min_top_right;
      }

      if (top_left_height < min_top_left) {
        top_left_height = 0 + min_top_left;
      }

      left_box_top += top_left_height;
      box_top += top_right_height;

      /* Middle */

      middle_right = sidebar - 120 - box_top_height - box_bottom_height - top_right_height - bottom_right_height;
      middle_left = left_sidebar - 120 - left_box_top_height - left_box_bottom_height - top_left_height - bottom_left_height;

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

      bottom_left_top = left_box_top + 20 + left_box_top_height + 20 + middle_left + 20 + left_box_bottom_height + 40;
      bottom_right_top = box_top + 20 + box_top_height + 20 + middle_right + 20 + box_bottom_height + 40;

      if (sidebar > height) {
        height = 0 + sidebar;
      }

      if (left_sidebar > height) {
        height = 0 + left_sidebar;
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
        image_aspect: image_aspect,
        image_width: image_width,
        image_height: Math.floor(image_width/image_aspect),
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
        bottom_left_width: bottom_left_width,
        bottom_left_top: bottom_left_top,
        bottom_right_top: bottom_right_top,
        header_ad_height: header_ad_height,
        header_ad_width: header_ad_width
      };
    }
  }
});
