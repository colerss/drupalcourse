/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/assets/vendor/jquery.ui/ui/disable-selection-min.js. */
/*!
 * jQuery UI Disable Selection 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","./version"],e):e(jQuery)}((function(e){"use strict";return e.fn.extend({disableSelection:(n="onselectstart"in document.createElement("div")?"selectstart":"mousedown",function(){return this.on(n+".ui-disableSelection",(function(e){e.preventDefault()}))}),enableSelection:function(){return this.off(".ui-disableSelection")}});var n}));
//# sourceMappingURL=disable-selection-min.js.map
/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/assets/vendor/jquery.ui/ui/disable-selection-min.js. */