/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/modules/contrib/webform/js/webform.admin.off-canvas.js. */
/**
 * @file
 * JavaScript behaviors for webform off-canvas dialogs.
 *
 * @see misc/dialog/off-canvas.js
 */

(function ($, Drupal, once) {

  'use strict';

  /**
   * Attaches webform off-canvas behaviors.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches event listeners to window for off-canvas dialogs.
   */
  Drupal.behaviors.webformOffCanvasEvents = {
    attach: function () {
      // Resize seven.theme tabs when off-canvas dialog opened and closed.
      // @see core/themes/seven/js/nav-tabs.js
      if(once('webform-off-canvas', 'html').length) {
        $(window).on({
          'dialog:aftercreate': function (event, dialog, $element, settings) {
            if (Drupal.offCanvas.isOffCanvas($element)) {
              $(window).trigger('resize.tabs');
            }
          },
          'dialog:afterclose': function (event, dialog, $element, settings) {
            if (Drupal.offCanvas.isOffCanvas($element)) {
              $(window).trigger('resize.tabs');
            }
          }
        });
      }
    }
  };

  // Append .ckeditor-off-canvas-reset to document to disable ckeditor reset.
  // @see webform_css_alter()
  // @see web/core/modules/ckeditor/js/ckeditor.off-canvas-css-reset.es6.js
  $(document.body).append('<style id="ckeditor-off-canvas-reset"></style>');

})(jQuery, Drupal, once);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/modules/contrib/webform/js/webform.admin.off-canvas.js. */