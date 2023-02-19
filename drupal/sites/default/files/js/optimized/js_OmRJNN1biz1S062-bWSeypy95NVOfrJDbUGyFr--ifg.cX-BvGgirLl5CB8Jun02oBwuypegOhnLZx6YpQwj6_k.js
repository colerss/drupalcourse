/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/modules/contrib/webform/js/webform.contextual.js. */
/**
 * @file
 * JavaScript behavior to remove destination from contextual links.
 */

(function ($, once) {

  'use strict';

  // Bind click event to all .contextual links which are
  // dynamically inserted via Ajax.
  // @see webform_contextual_links_view_alter()
  // @see Drupal.behaviors.contextual
  $(document).on('click', '.contextual', function () {
    $(once('webform-contextual', 'a.webform-contextual', this)).each(function () {
      this.href = this.href.split('?')[0];

      // Add ?_webform_test={webform} to the current page's URL.
      // phpcs:ignore
      if (/webform\/([^/]+)\/test$/.test(this.href)) {
        this.href = window.location.pathname + '?_webform_test=' + RegExp.$1;
      }
    });
  });

})(jQuery, once);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/modules/contrib/webform/js/webform.contextual.js. */