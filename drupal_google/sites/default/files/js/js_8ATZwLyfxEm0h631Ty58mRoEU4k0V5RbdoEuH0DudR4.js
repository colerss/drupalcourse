/* Source and licensing information for the line(s) below can be found at http://localhost/drupal_google/core/themes/olivero/js/navigation-utils.js. */
/**
 * @file
 * Controls the visibility of desktop navigation.
 *
 * Shows and hides the desktop navigation based on scroll position and controls
 * the functionality of the button that shows/hides the navigation.
 */

/* eslint-disable no-inner-declarations */
((Drupal) => {
  /**
   * Olivero helper functions.
   *
   * @namespace
   */
  Drupal.olivero = {};

  /**
   * Checks if the mobile navigation button is visible.
   *
   * @return {boolean}
   *   True if navButtons is hidden, false if not.
   */
  function isDesktopNav() {
    const navButtons = document.querySelector(
      '[data-drupal-selector="mobile-buttons"]',
    );
    return navButtons
      ? window.getComputedStyle(navButtons).getPropertyValue('display') ===
          'none'
      : false;
  }

  Drupal.olivero.isDesktopNav = isDesktopNav;

  const stickyHeaderToggleButton = document.querySelector(
    '[data-drupal-selector="sticky-header-toggle"]',
  );
  const siteHeaderFixable = document.querySelector(
    '[data-drupal-selector="site-header-fixable"]',
  );

  /**
   * Checks if the sticky header is enabled.
   *
   * @return {boolean}
   *   True if sticky header is enabled, false if not.
   */
  function stickyHeaderIsEnabled() {
    return stickyHeaderToggleButton.getAttribute('aria-checked') === 'true';
  }

  /**
   * Save the current sticky header expanded state to localStorage, and set
   * it to expire after two weeks.
   *
   * @param {boolean} expandedState
   *   Current state of the sticky header button.
   */
  function setStickyHeaderStorage(expandedState) {
    const now = new Date();

    const item = {
      value: expandedState,
      expiry: now.getTime() + 20160000, // 2 weeks from now.
    };
    localStorage.setItem(
      'Drupal.olivero.stickyHeaderState',
      JSON.stringify(item),
    );
  }

  /**
   * Toggle the state of the sticky header between always pinned and
   * only pinned when scrolled to the top of the viewport.
   *
   * @param {boolean} pinnedState
   *   State to change the sticky header to.
   */
  function toggleStickyHeaderState(pinnedState) {
    if (isDesktopNav()) {
      if (pinnedState === true) {
        siteHeaderFixable.classList.add('is-expanded');
      } else {
        siteHeaderFixable.classList.remove('is-expanded');
      }

      stickyHeaderToggleButton.setAttribute('aria-checked', pinnedState);
      setStickyHeaderStorage(pinnedState);
    }
  }

  /**
   * Return the sticky header's stored state from localStorage.
   *
   * @return {boolean}
   *   Stored state of the sticky header.
   */
  function getStickyHeaderStorage() {
    const stickyHeaderState = localStorage.getItem(
      'Drupal.olivero.stickyHeaderState',
    );

    if (!stickyHeaderState) return false;

    const item = JSON.parse(stickyHeaderState);
    const now = new Date();

    // Compare the expiry time of the item with the current time.
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage and return null.
      localStorage.removeItem('Drupal.olivero.stickyHeaderState');
      return false;
    }
    return item.value;
  }

  // Only enable scroll interactivity if the browser supports Intersection
  // Observer.
  // @see https://github.com/w3c/IntersectionObserver/blob/master/polyfill/intersection-observer.js#L19-L21
  if (
    'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype
  ) {
    const fixableElements = document.querySelectorAll(
      '[data-drupal-selector="site-header-fixable"], [data-drupal-selector="social-bar-inner"]',
    );

    function toggleDesktopNavVisibility(entries) {
      if (!isDesktopNav()) return;

      entries.forEach((entry) => {
        // Firefox doesn't seem to support entry.isIntersecting properly,
        // so we check the intersectionRatio.
        if (entry.intersectionRatio < 1) {
          fixableElements.forEach((el) => el.classList.add('is-fixed'));
        } else {
          fixableElements.forEach((el) => el.classList.remove('is-fixed'));
        }
      });
    }

    /**
     * Gets the root margin by checking for various toolbar classes.
     *
     * @return {string}
     *   Root margin for the Intersection Observer options object.
     */
    function getRootMargin() {
      let rootMarginTop = 72;
      const { body } = document;

      if (body.classList.contains('toolbar-fixed')) {
        rootMarginTop -= 39;
      }

      if (
        body.classList.contains('toolbar-horizontal') &&
        body.classList.contains('toolbar-tray-open')
      ) {
        rootMarginTop -= 40;
      }

      return `${rootMarginTop}px 0px 0px 0px`;
    }

    /**
     * Monitor the navigation position.
     */
    function monitorNavPosition() {
      const primaryNav = document.querySelector(
        '[data-drupal-selector="site-header"]',
      );
      const options = {
        rootMargin: getRootMargin(),
        threshold: [0.999, 1],
      };

      const observer = new IntersectionObserver(
        toggleDesktopNavVisibility,
        options,
      );

      if (primaryNav) {
        observer.observe(primaryNav);
      }
    }

    if (stickyHeaderToggleButton) {
      stickyHeaderToggleButton.addEventListener('click', () => {
        toggleStickyHeaderState(!stickyHeaderIsEnabled());
      });
    }

    // If header is pinned open and a header element gains focus, scroll to the
    // top of the page to ensure that the header elements can be seen.
    const siteHeaderInner = document.querySelector(
      '[data-drupal-selector="site-header-inner"]',
    );
    if (siteHeaderInner) {
      siteHeaderInner.addEventListener('focusin', () => {
        if (isDesktopNav() && !stickyHeaderIsEnabled()) {
          const header = document.querySelector(
            '[data-drupal-selector="site-header"]',
          );
          const headerNav = header.querySelector(
            '[data-drupal-selector="header-nav"]',
          );
          const headerMargin = header.clientHeight - headerNav.clientHeight;
          if (window.scrollY > headerMargin) {
            window.scrollTo(0, headerMargin);
          }
        }
      });
    }

    monitorNavPosition();
    setStickyHeaderStorage(getStickyHeaderStorage());
    toggleStickyHeaderState(getStickyHeaderStorage());
  }
})(Drupal);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal_google/core/themes/olivero/js/navigation-utils.js. */;
/* Source and licensing information for the line(s) below can be found at http://localhost/drupal_google/core/themes/olivero/js/search.js. */
/**
 * @file
 * Wide viewport search bar interactions.
 */

((Drupal) => {
  const searchWideButtonSelector =
    '[data-drupal-selector="block-search-wide-button"]';
  const searchWideButton = document.querySelector(searchWideButtonSelector);
  const searchWideWrapperSelector =
    '[data-drupal-selector="block-search-wide-wrapper"]';
  const searchWideWrapper = document.querySelector(searchWideWrapperSelector);

  /**
   * Determine if search is visible.
   *
   * @return {boolean}
   *   True if the search wrapper contains "is-active" class, false if not.
   */
  function searchIsVisible() {
    return searchWideWrapper.classList.contains('is-active');
  }
  Drupal.olivero.searchIsVisible = searchIsVisible;

  /**
   * Closes search bar when a click event does not happen at an (x,y) coordinate
   * that does not overlap with either the search wrapper or button.
   *
   * @see https://bugs.webkit.org/show_bug.cgi?id=229895
   *
   * @param {Event} e click event
   */
  function watchForClickOut(e) {
    const clickInSearchArea = e.target.matches(`
      ${searchWideWrapperSelector},
      ${searchWideWrapperSelector} *,
      ${searchWideButtonSelector},
      ${searchWideButtonSelector} *
    `);
    if (!clickInSearchArea && searchIsVisible()) {
      // eslint-disable-next-line no-use-before-define
      toggleSearchVisibility(false);
    }
  }

  /**
   * Closes search bar when focus moves to another target.
   * Avoids closing search bar if event does not have related target - required for Safari.
   *
   * @see https://bugs.webkit.org/show_bug.cgi?id=229895
   *
   * @param {Event} e focusout event
   */
  function watchForFocusOut(e) {
    if (e.relatedTarget) {
      const inSearchBar = e.relatedTarget.matches(
        `${searchWideWrapperSelector}, ${searchWideWrapperSelector} *`,
      );
      const inSearchButton = e.relatedTarget.matches(
        `${searchWideButtonSelector}, ${searchWideButtonSelector} *`,
      );

      if (!inSearchBar && !inSearchButton) {
        // eslint-disable-next-line no-use-before-define
        toggleSearchVisibility(false);
      }
    }
  }

  /**
   * Closes search bar on escape keyup, if open.
   *
   * @param {Event} e keyup event
   */
  function watchForEscapeOut(e) {
    if (e.key === 'Escape') {
      // eslint-disable-next-line no-use-before-define
      toggleSearchVisibility(false);
    }
  }

  /**
   * Set focus for the search input element.
   */
  function handleFocus() {
    if (searchIsVisible()) {
      searchWideWrapper.querySelector('input[type="search"]').focus();
    } else if (searchWideWrapper.contains(document.activeElement)) {
      // Return focus to button only if focus was inside of the search wrapper.
      searchWideButton.focus();
    }
  }

  /**
   * Toggle search functionality visibility.
   *
   * @param {boolean} visibility
   *   True if we want to show the form, false if we want to hide it.
   */
  function toggleSearchVisibility(visibility) {
    searchWideButton.setAttribute('aria-expanded', visibility === true);
    searchWideWrapper.addEventListener('transitionend', handleFocus, {
      once: true,
    });

    if (visibility === true) {
      Drupal.olivero.closeAllSubNav();
      searchWideWrapper.classList.add('is-active');

      document.addEventListener('click', watchForClickOut, { capture: true });
      document.addEventListener('focusout', watchForFocusOut, {
        capture: true,
      });
      document.addEventListener('keyup', watchForEscapeOut, { capture: true });
    } else {
      searchWideWrapper.classList.remove('is-active');

      document.removeEventListener('click', watchForClickOut, {
        capture: true,
      });
      document.removeEventListener('focusout', watchForFocusOut, {
        capture: true,
      });
      document.removeEventListener('keyup', watchForEscapeOut, {
        capture: true,
      });
    }
  }

  Drupal.olivero.toggleSearchVisibility = toggleSearchVisibility;

  /**
   * Initializes the search wide button.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *  Adds aria-expanded attribute to the search wide button.
   */
  Drupal.behaviors.searchWide = {
    attach(context) {
      const searchWideButtonEl = once(
        'search-wide',
        searchWideButtonSelector,
        context,
      ).shift();
      if (searchWideButtonEl) {
        searchWideButtonEl.setAttribute('aria-expanded', searchIsVisible());
        searchWideButtonEl.addEventListener('click', () => {
          toggleSearchVisibility(!searchIsVisible());
        });
      }
    },
  };
})(Drupal);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal_google/core/themes/olivero/js/search.js. */;
/* Source and licensing information for the line(s) below can be found at http://localhost/drupal_google/core/themes/olivero/js/navigation.js. */
/**
 * @file
 * Customization of navigation.
 */

((Drupal, once, tabbable) => {
  /**
   * Checks if navWrapper contains "is-active" class.
   *
   * @param {Element} navWrapper
   *   Header navigation.
   *
   * @return {boolean}
   *   True if navWrapper contains "is-active" class, false if not.
   */
  function isNavOpen(navWrapper) {
    return navWrapper.classList.contains('is-active');
  }

  /**
   * Opens or closes the header navigation.
   *
   * @param {object} props
   *   Navigation props.
   * @param {boolean} state
   *   State which to transition the header navigation menu into.
   */
  function toggleNav(props, state) {
    const value = !!state;
    props.navButton.setAttribute('aria-expanded', value);

    if (value) {
      props.body.classList.add('is-overlay-active');
      props.body.classList.add('is-fixed');
      props.navWrapper.classList.add('is-active');
    } else {
      props.body.classList.remove('is-overlay-active');
      props.body.classList.remove('is-fixed');
      props.navWrapper.classList.remove('is-active');
    }
  }

  /**
   * Initialize the header navigation.
   *
   * @param {object} props
   *   Navigation props.
   */
  function init(props) {
    props.navButton.setAttribute('aria-controls', props.navWrapperId);
    props.navButton.setAttribute('aria-expanded', 'false');

    props.navButton.addEventListener('click', () => {
      toggleNav(props, !isNavOpen(props.navWrapper));
    });

    // Close any open sub-navigation first, then close the header navigation.
    document.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        if (props.olivero.areAnySubNavsOpen()) {
          props.olivero.closeAllSubNav();
        } else {
          toggleNav(props, false);
        }
      }
    });

    props.overlay.addEventListener('click', () => {
      toggleNav(props, false);
    });

    props.overlay.addEventListener('touchstart', () => {
      toggleNav(props, false);
    });

    // Focus trap. This is added to the header element because the navButton
    // element is not a child element of the navWrapper element, and the keydown
    // event would not fire if focus is on the navButton element.
    props.header.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && isNavOpen(props.navWrapper)) {
        const tabbableNavElements = tabbable.tabbable(props.navWrapper);
        tabbableNavElements.unshift(props.navButton);
        const firstTabbableEl = tabbableNavElements[0];
        const lastTabbableEl =
          tabbableNavElements[tabbableNavElements.length - 1];

        if (e.shiftKey) {
          if (
            document.activeElement === firstTabbableEl &&
            !props.olivero.isDesktopNav()
          ) {
            lastTabbableEl.focus();
            e.preventDefault();
          }
        } else if (
          document.activeElement === lastTabbableEl &&
          !props.olivero.isDesktopNav()
        ) {
          firstTabbableEl.focus();
          e.preventDefault();
        }
      }
    });

    // Remove overlays when browser is resized and desktop nav appears.
    window.addEventListener('resize', () => {
      if (props.olivero.isDesktopNav()) {
        toggleNav(props, false);
        props.body.classList.remove('is-overlay-active');
        props.body.classList.remove('is-fixed');
      }

      // Ensure that all sub-navigation menus close when the browser is resized.
      Drupal.olivero.closeAllSubNav();
    });

    // If hyperlink links to an anchor in the current page, close the
    // mobile menu after the click.
    props.navWrapper.addEventListener('click', (e) => {
      if (
        e.target.matches(
          `[href*="${window.location.pathname}#"], [href*="${window.location.pathname}#"] *, [href^="#"], [href^="#"] *`,
        )
      ) {
        toggleNav(props, false);
      }
    });
  }

  /**
   * Initialize the navigation.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attach context and settings for navigation.
   */
  Drupal.behaviors.oliveroNavigation = {
    attach(context) {
      const headerId = 'header';
      const header = once('navigation', `#${headerId}`, context).shift();
      const navWrapperId = 'header-nav';

      if (header) {
        const navWrapper = header.querySelector(`#${navWrapperId}`);
        const { olivero } = Drupal;
        const navButton = context.querySelector(
          '[data-drupal-selector="mobile-nav-button"]',
        );
        const body = document.body;
        const overlay = context.querySelector(
          '[data-drupal-selector="header-nav-overlay"]',
        );

        init({
          olivero,
          header,
          navWrapperId,
          navWrapper,
          navButton,
          body,
          overlay,
        });
      }
    },
  };
})(Drupal, once, tabbable);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal_google/core/themes/olivero/js/navigation.js. */;
