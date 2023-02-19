/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/misc/touchevents-test.js. */
/**
 * @file
 * A replacement for Modernizr touch events detection.
 */

document.documentElement.classList.add(
  'ontouchstart' in window ||
    (window.DocumentTouch && document instanceof window.DocumentTouch)
    ? 'touchevents'
    : 'no-touchevents',
);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/misc/touchevents-test.js. */