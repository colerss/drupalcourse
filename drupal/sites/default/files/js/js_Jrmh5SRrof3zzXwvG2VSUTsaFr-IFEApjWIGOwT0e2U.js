/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/themes/claro/js/messages.js. */
/**
 * @file
 * Message template overrides.
 */

((Drupal) => {
  /**
   * Overrides message theme function.
   *
   * @param {object} message
   *   The message object.
   * @param {string} message.text
   *   The message text.
   * @param {object} options
   *   The message context.
   * @param {string} options.type
   *   The message type.
   * @param {string} options.id
   *   ID of the message, for reference.
   *
   * @return {HTMLElement}
   *   A DOM Node.
   */
  Drupal.theme.message = ({ text }, { type, id }) => {
    const messagesTypes = Drupal.Message.getMessageTypeLabels();
    const messageWrapper = document.createElement('div');

    messageWrapper.setAttribute('class', `messages messages--${type}`);
    messageWrapper.setAttribute(
      'role',
      type === 'error' || type === 'warning' ? 'alert' : 'status',
    );
    messageWrapper.setAttribute('aria-labelledby', `${id}-title`);
    messageWrapper.setAttribute('data-drupal-message-id', id);
    messageWrapper.setAttribute('data-drupal-message-type', type);

    messageWrapper.innerHTML = `
    <div class="messages__header">
      <h2 id="${id}-title" class="messages__title">
        ${messagesTypes[type]}
      </h2>
    </div>
    <div class="messages__content">
      ${text}
    </div>
  `;

    return messageWrapper;
  };
})(Drupal);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/themes/claro/js/messages.js. */;
/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/misc/active-link.js. */
/**
 * @file
 * Attaches behaviors for Drupal's active link marking.
 */

(function (Drupal, drupalSettings) {
  /**
   * Append is-active class.
   *
   * The link is only active if its path corresponds to the current path, the
   * language of the linked path is equal to the current language, and if the
   * query parameters of the link equal those of the current request, since the
   * same request with different query parameters may yield a different page
   * (e.g. pagers, exposed View filters).
   *
   * Does not discriminate based on element type, so allows you to set the
   * is-active class on any element: a, li…
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.activeLinks = {
    attach(context) {
      // Start by finding all potentially active links.
      const path = drupalSettings.path;
      const queryString = JSON.stringify(path.currentQuery);
      const querySelector = path.currentQuery
        ? `[data-drupal-link-query='${queryString}']`
        : ':not([data-drupal-link-query])';
      const originalSelectors = [
        `[data-drupal-link-system-path="${path.currentPath}"]`,
      ];
      let selectors;

      // If this is the front page, we have to check for the <front> path as
      // well.
      if (path.isFront) {
        originalSelectors.push('[data-drupal-link-system-path="<front>"]');
      }

      // Add language filtering.
      selectors = [].concat(
        // Links without any hreflang attributes (most of them).
        originalSelectors.map((selector) => `${selector}:not([hreflang])`),
        // Links with hreflang equals to the current language.
        originalSelectors.map(
          (selector) => `${selector}[hreflang="${path.currentLanguage}"]`,
        ),
      );

      // Add query string selector for pagers, exposed filters.
      selectors = selectors.map((current) => current + querySelector);

      // Query the DOM.
      const activeLinks = context.querySelectorAll(selectors.join(','));
      const il = activeLinks.length;
      for (let i = 0; i < il; i++) {
        activeLinks[i].classList.add('is-active');
      }
    },
    detach(context, settings, trigger) {
      if (trigger === 'unload') {
        const activeLinks = context.querySelectorAll(
          '[data-drupal-link-system-path].is-active',
        );
        const il = activeLinks.length;
        for (let i = 0; i < il; i++) {
          activeLinks[i].classList.remove('is-active');
        }
      }
    },
  };
})(Drupal, drupalSettings);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/misc/active-link.js. */;
/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/modules/menu_ui/menu_ui.admin.js. */
/**
 * @file
 * Menu UI admin behaviors.
 */

(function ($, Drupal) {
  /**
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.menuUiChangeParentItems = {
    attach(context, settings) {
      const menu = once('menu-parent', '#edit-menu');
      if (menu.length) {
        const $menu = $(menu);
        // Update the list of available parent menu items to match the initial
        // available menus.
        Drupal.menuUiUpdateParentList();

        // Update list of available parent menu items.
        $menu.on('change', 'input', Drupal.menuUiUpdateParentList);
      }
    },
  };

  /**
   * Function to set the options of the menu parent item dropdown.
   */
  Drupal.menuUiUpdateParentList = function () {
    const $menu = $('#edit-menu');
    const values = [];

    $menu.find('input:checked').each(function () {
      // Get the names of all checked menus.
      values.push(Drupal.checkPlain(this.value));
    });

    $.ajax({
      url: `${window.location.protocol}//${window.location.host}${Drupal.url(
        'admin/structure/menu/parents',
      )}`,
      type: 'POST',
      data: { 'menus[]': values },
      dataType: 'json',
      success(options) {
        const $select = $('#edit-menu-parent');
        // Save key of last selected element.
        const selected = $select[0].value;
        // Remove all existing options from dropdown.
        $select.children().remove();
        // Add new options to dropdown. Keep a count of options for testing later.
        let totalOptions = 0;
        Object.keys(options || {}).forEach((machineName) => {
          const selectContents = document.createElement('option');
          selectContents.selected = machineName === selected;
          selectContents.value = machineName;
          selectContents.textContent = options[machineName];
          $select.append(selectContents);
          totalOptions++;
        });

        // Hide the parent options if there are no options for it.
        $select
          .closest('div')
          .toggle(totalOptions > 0)
          .attr('hidden', totalOptions === 0);
      },
    });
  };
})(jQuery, Drupal);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/modules/menu_ui/menu_ui.admin.js. */;
/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/misc/form.js. */
/**
 * @file
 * Form features.
 */

/**
 * Triggers when a value in the form changed.
 *
 * The event triggers when content is typed or pasted in a text field, before
 * the change event triggers.
 *
 * @event formUpdated
 */

/**
 * Triggers when a click on a page fragment link or hash change is detected.
 *
 * The event triggers when the fragment in the URL changes (a hash change) and
 * when a link containing a fragment identifier is clicked. In case the hash
 * changes due to a click this event will only be triggered once.
 *
 * @event formFragmentLinkClickOrHashChange
 */

(function ($, Drupal, debounce) {
  /**
   * Retrieves the summary for the first element.
   *
   * @return {string}
   *   The text of the summary.
   */
  $.fn.drupalGetSummary = function () {
    const callback = this.data('summaryCallback');
    return this[0] && callback ? callback(this[0]).trim() : '';
  };

  /**
   * Sets the summary for all matched elements.
   *
   * @param {function} callback
   *   Either a function that will be called each time the summary is
   *   retrieved or a string (which is returned each time).
   *
   * @return {jQuery}
   *   jQuery collection of the current element.
   *
   * @fires event:summaryUpdated
   *
   * @listens event:formUpdated
   */
  $.fn.drupalSetSummary = function (callback) {
    const self = this;

    // To facilitate things, the callback should always be a function. If it's
    // not, we wrap it into an anonymous function which just returns the value.
    if (typeof callback !== 'function') {
      const val = callback;
      callback = function () {
        return val;
      };
    }

    return (
      this.data('summaryCallback', callback)
        // To prevent duplicate events, the handlers are first removed and then
        // (re-)added.
        .off('formUpdated.summary')
        .on('formUpdated.summary', () => {
          self.trigger('summaryUpdated');
        })
        // The actual summaryUpdated handler doesn't fire when the callback is
        // changed, so we have to do this manually.
        .trigger('summaryUpdated')
    );
  };

  /**
   * Prevents consecutive form submissions of identical form values.
   *
   * Repetitive form submissions that would submit the identical form values
   * are prevented, unless the form values are different to the previously
   * submitted values.
   *
   * This is a simplified re-implementation of a user-agent behavior that
   * should be natively supported by major web browsers, but at this time, only
   * Firefox has a built-in protection.
   *
   * A form value-based approach ensures that the constraint is triggered for
   * consecutive, identical form submissions only. Compared to that, a form
   * button-based approach would (1) rely on [visible] buttons to exist where
   * technically not required and (2) require more complex state management if
   * there are multiple buttons in a form.
   *
   * This implementation is based on form-level submit events only and relies
   * on jQuery's serialize() method to determine submitted form values. As such,
   * the following limitations exist:
   *
   * - Event handlers on form buttons that preventDefault() do not receive a
   *   double-submit protection. That is deemed to be fine, since such button
   *   events typically trigger reversible client-side or server-side
   *   operations that are local to the context of a form only.
   * - Changed values in advanced form controls, such as file inputs, are not
   *   part of the form values being compared between consecutive form submits
   *   (due to limitations of jQuery.serialize()). That is deemed to be
   *   acceptable, because if the user forgot to attach a file, then the size of
   *   HTTP payload will most likely be small enough to be fully passed to the
   *   server endpoint within (milli)seconds. If a user mistakenly attached a
   *   wrong file and is technically versed enough to cancel the form submission
   *   (and HTTP payload) in order to attach a different file, then that
   *   edge-case is not supported here.
   *
   * Lastly, all forms submitted via HTTP GET are idempotent by definition of
   * HTTP standards, so excluded in this implementation.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.formSingleSubmit = {
    attach() {
      function onFormSubmit(e) {
        const $form = $(e.currentTarget);
        const formValues = $form.serialize();
        const previousValues = $form.attr('data-drupal-form-submit-last');
        if (previousValues === formValues) {
          e.preventDefault();
        } else {
          $form.attr('data-drupal-form-submit-last', formValues);
        }
      }

      $(once('form-single-submit', 'body')).on(
        'submit.singleSubmit',
        'form:not([method~="GET"])',
        onFormSubmit,
      );
    },
  };

  /**
   * Sends a 'formUpdated' event each time a form element is modified.
   *
   * @param {HTMLElement} element
   *   The element to trigger a form updated event on.
   *
   * @fires event:formUpdated
   */
  function triggerFormUpdated(element) {
    $(element).trigger('formUpdated');
  }

  /**
   * Collects the IDs of all form fields in the given form.
   *
   * @param {HTMLFormElement} form
   *   The form element to search.
   *
   * @return {Array}
   *   Array of IDs for form fields.
   */
  function fieldsList(form) {
    // We use id to avoid name duplicates on radio fields and filter out
    // elements with a name but no id.
    return [].map.call(form.querySelectorAll('[name][id]'), (el) => el.id);
  }

  /**
   * Triggers the 'formUpdated' event on form elements when they are modified.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches formUpdated behaviors.
   * @prop {Drupal~behaviorDetach} detach
   *   Detaches formUpdated behaviors.
   *
   * @fires event:formUpdated
   */
  Drupal.behaviors.formUpdated = {
    attach(context) {
      const $context = $(context);
      const contextIsForm = $context.is('form');
      const $forms = $(
        once('form-updated', contextIsForm ? $context : $context.find('form')),
      );
      let formFields;

      if ($forms.length) {
        // Initialize form behaviors, use $.makeArray to be able to use native
        // forEach array method and have the callback parameters in the right
        // order.
        $.makeArray($forms).forEach((form) => {
          const events = 'change.formUpdated input.formUpdated ';
          const eventHandler = debounce((event) => {
            triggerFormUpdated(event.target);
          }, 300);
          formFields = fieldsList(form).join(',');

          form.setAttribute('data-drupal-form-fields', formFields);
          $(form).on(events, eventHandler);
        });
      }
      // On ajax requests context is the form element.
      if (contextIsForm) {
        formFields = fieldsList(context).join(',');
        // @todo replace with form.getAttribute() when #1979468 is in.
        const currentFields = $(context).attr('data-drupal-form-fields');
        // If there has been a change in the fields or their order, trigger
        // formUpdated.
        if (formFields !== currentFields) {
          triggerFormUpdated(context);
        }
      }
    },
    detach(context, settings, trigger) {
      const $context = $(context);
      const contextIsForm = $context.is('form');
      if (trigger === 'unload') {
        once
          .remove(
            'form-updated',
            contextIsForm ? $context : $context.find('form'),
          )
          .forEach((form) => {
            form.removeAttribute('data-drupal-form-fields');
            $(form).off('.formUpdated');
          });
      }
    },
  };

  /**
   * Prepopulate form fields with information from the visitor browser.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches the behavior for filling user info from browser.
   */
  Drupal.behaviors.fillUserInfoFromBrowser = {
    attach(context, settings) {
      const userInfo = ['name', 'mail', 'homepage'];
      const $forms = $(
        once('user-info-from-browser', '[data-user-info-from-browser]'),
      );
      if ($forms.length) {
        userInfo.forEach((info) => {
          const $element = $forms.find(`[name=${info}]`);
          const browserData = localStorage.getItem(`Drupal.visitor.${info}`);
          if (!$element.length) {
            return;
          }
          const emptyValue = $element[0].value === '';
          const defaultValue =
            $element.attr('data-drupal-default-value') === $element[0].value;
          if (browserData && (emptyValue || defaultValue)) {
            $element.each(function (index, item) {
              item.value = browserData;
            });
          }
        });
      }
      $forms.on('submit', () => {
        userInfo.forEach((info) => {
          const $element = $forms.find(`[name=${info}]`);
          if ($element.length) {
            localStorage.setItem(`Drupal.visitor.${info}`, $element[0].value);
          }
        });
      });
    },
  };

  /**
   * Sends a fragment interaction event on a hash change or fragment link click.
   *
   * @param {jQuery.Event} e
   *   The event triggered.
   *
   * @fires event:formFragmentLinkClickOrHashChange
   */
  const handleFragmentLinkClickOrHashChange = (e) => {
    let url;
    if (e.type === 'click') {
      url = e.currentTarget.location
        ? e.currentTarget.location
        : e.currentTarget;
    } else {
      url = window.location;
    }
    const hash = url.hash.substr(1);
    if (hash) {
      const $target = $(`#${hash}`);
      $('body').trigger('formFragmentLinkClickOrHashChange', [$target]);

      /**
       * Clicking a fragment link or a hash change should focus the target
       * element, but event timing issues in multiple browsers require a timeout.
       */
      setTimeout(() => $target.trigger('focus'), 300);
    }
  };

  const debouncedHandleFragmentLinkClickOrHashChange = debounce(
    handleFragmentLinkClickOrHashChange,
    300,
    true,
  );

  // Binds a listener to handle URL fragment changes.
  $(window).on(
    'hashchange.form-fragment',
    debouncedHandleFragmentLinkClickOrHashChange,
  );

  /**
   * Binds a listener to handle clicks on fragment links and absolute URL links
   * containing a fragment, this is needed next to the hash change listener
   * because clicking such links doesn't trigger a hash change when the fragment
   * is already in the URL.
   */
  $(document).on(
    'click.form-fragment',
    'a[href*="#"]',
    debouncedHandleFragmentLinkClickOrHashChange,
  );
})(jQuery, Drupal, Drupal.debounce);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/misc/form.js. */;
/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/misc/details-summarized-content.js. */
/**
 * @file
 * Adds a summary of a details element's contents to its summary element.
 */
(($, Drupal) => {
  /**
   * The DetailsSummarizedContent object represents a single details element.
   *
   * @constructor Drupal.DetailsSummarizedContent
   *
   * @param {HTMLElement} node
   *   A details element, the summary of which may have supplemental text.
   *   The supplemental text summarizes the details element's contents.
   */
  function DetailsSummarizedContent(node) {
    this.$node = $(node);
    this.setupSummary();
  }

  $.extend(
    DetailsSummarizedContent,
    /** @lends Drupal.DetailsSummarizedContent */ {
      /**
       * Holds references to instantiated DetailsSummarizedContent objects.
       *
       * @type {Array.<Drupal.DetailsSummarizedContent>}
       */
      instances: [],
    },
  );

  $.extend(
    DetailsSummarizedContent.prototype,
    /** @lends Drupal.DetailsSummarizedContent# */ {
      /**
       * Initialize and setup summary events and markup.
       *
       * @fires event:summaryUpdated
       *
       * @listens event:summaryUpdated
       */
      setupSummary() {
        this.$detailsSummarizedContentWrapper = $(
          Drupal.theme('detailsSummarizedContentWrapper'),
        );
        this.$node
          .on('summaryUpdated', $.proxy(this.onSummaryUpdated, this))
          .trigger('summaryUpdated')
          .find('> summary')
          .append(this.$detailsSummarizedContentWrapper);
      },

      /**
       * Update summary.
       */
      onSummaryUpdated() {
        const text = this.$node.drupalGetSummary();
        this.$detailsSummarizedContentWrapper.html(
          Drupal.theme('detailsSummarizedContentText', text),
        );
      },
    },
  );

  /**
   * Adds a summary of a details element's contents to its summary element.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches behavior for the details element.
   */
  Drupal.behaviors.detailsSummary = {
    attach(context) {
      DetailsSummarizedContent.instances =
        DetailsSummarizedContent.instances.concat(
          once('details', 'details', context).map(
            (details) => new DetailsSummarizedContent(details),
          ),
        );
    },
  };

  Drupal.DetailsSummarizedContent = DetailsSummarizedContent;

  /**
   * The element containing a wrapper for summarized details content.
   *
   * @return {string}
   *   The markup for the element that will contain the summarized content.
   */
  Drupal.theme.detailsSummarizedContentWrapper = () =>
    `<span class="summary"></span>`;

  /**
   * Formats the summarized details content text.
   *
   * @param {string|null} [text]
   *   (optional) The summarized content text displayed in the summary.
   * @return {string}
   *   The formatted summarized content text.
   */
  Drupal.theme.detailsSummarizedContentText = (text) =>
    text ? ` (${text})` : '';
})(jQuery, Drupal);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/misc/details-summarized-content.js. */;
/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/misc/details-aria.js. */
/**
 * @file
 * Add aria attribute handling for details and summary elements.
 */

(function ($, Drupal) {
  /**
   * Handles `aria-expanded` and `aria-pressed` attributes on details elements.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.detailsAria = {
    attach() {
      $(once('detailsAria', 'body')).on(
        'click.detailsAria',
        'summary',
        (event) => {
          const $summary = $(event.currentTarget);
          const open =
            $(event.currentTarget.parentNode).attr('open') === 'open'
              ? 'false'
              : 'true';

          $summary.attr({
            'aria-expanded': open,
            'aria-pressed': open,
          });
        },
      );
    },
  };
})(jQuery, Drupal);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/misc/details-aria.js. */;
/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/misc/details.js. */
/**
 * @file
 * Additional functionality for HTML5 details elements.
 */

(function ($) {
  /**
   * Open parent details elements of a targeted page fragment.
   *
   * Opens all (nested) details element on a hash change or fragment link click
   * when the target is a child element, in order to make sure the targeted
   * element is visible. Aria attributes on the summary
   * are set by triggering the click event listener in details-aria.js.
   *
   * @param {jQuery.Event} e
   *   The event triggered.
   * @param {jQuery} $target
   *   The targeted node as a jQuery object.
   */
  const handleFragmentLinkClickOrHashChange = (e, $target) => {
    $target.parents('details').not('[open]').find('> summary').trigger('click');
  };

  /**
   * Binds a listener to handle fragment link clicks and URL hash changes.
   */
  $('body').on(
    'formFragmentLinkClickOrHashChange.details',
    handleFragmentLinkClickOrHashChange,
  );
})(jQuery);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/misc/details.js. */;
/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/themes/claro/js/details.js. */
/**
 * @file
 * Claro's polyfill enhancements for HTML5 details.
 */

(($, Drupal) => {
  /**
   * Workaround for Firefox.
   *
   * Firefox applies the focus state only for keyboard navigation.
   * We have to manually trigger focus to make the behavior consistent across
   * browsers.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.claroDetails = {
    attach(context) {
      // The second argument of once() needs to be an instance of Element, but
      // document is an instance of Document, replace it with the html Element.
      $(once('claroDetails', context === document ? 'html' : context)).on(
        'click',
        (event) => {
          if (event.target.nodeName === 'SUMMARY') {
            $(event.target).trigger('focus');
          }
        },
      );
    },
  };

  /**
   * Theme override providing a wrapper for summarized details content.
   *
   * @return {string}
   *   The markup for the element that will contain the summarized content.
   */
  Drupal.theme.detailsSummarizedContentWrapper = () =>
    `<span class="claro-details__summary-summary"></span>`;

  /**
   * Theme override of summarized details content text.
   *
   * @param {string|null} [text]
   *   (optional) The summarized content displayed in the summary.
   * @return {string}
   *   The formatted summarized content text.
   */
  Drupal.theme.detailsSummarizedContentText = (text) => text || '';
})(jQuery, Drupal);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/themes/claro/js/details.js. */;
/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/modules/node/content_types.js. */
/**
 * @file
 * JavaScript for the node content editing form.
 */

(function ($, Drupal) {
  /**
   * Behaviors for setting summaries on content type form.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches summary behaviors on content type edit forms.
   */
  Drupal.behaviors.contentTypes = {
    attach(context) {
      const $context = $(context);
      // Provide the vertical tab summaries.
      $context.find('#edit-submission').drupalSetSummary((context) => {
        const values = [];
        values.push(
          Drupal.checkPlain($(context).find('#edit-title-label')[0].value) ||
            Drupal.t('Requires a title'),
        );
        return values.join(', ');
      });
      $context.find('#edit-workflow').drupalSetSummary((context) => {
        const values = [];
        $(context)
          .find('input[name^="options"]:checked')
          .next('label')
          .each(function () {
            values.push(Drupal.checkPlain(this.textContent));
          });
        if (!$(context).find('#edit-options-status').is(':checked')) {
          values.unshift(Drupal.t('Not published'));
        }
        return values.join(', ');
      });
      $('#edit-language', context).drupalSetSummary((context) => {
        const values = [];

        values.push(
          $(
            '.js-form-item-language-configuration-langcode select option:selected',
            context,
          )[0].textContent,
        );

        $('input:checked', context)
          .next('label')
          .each(function () {
            values.push(Drupal.checkPlain(this.textContent));
          });

        return values.join(', ');
      });
      $context.find('#edit-display').drupalSetSummary((context) => {
        const values = [];
        const $editContext = $(context);
        $editContext
          .find('input:checked')
          .next('label')
          .each(function () {
            values.push(Drupal.checkPlain(this.textContent));
          });
        if (!$editContext.find('#edit-display-submitted').is(':checked')) {
          values.unshift(Drupal.t("Don't display post information"));
        }
        return values.join(', ');
      });
    },
  };
})(jQuery, Drupal);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/modules/node/content_types.js. */;
/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/themes/claro/js/vertical-tabs.js. */
/**
 * @file
 * Overrides vertical tabs theming to enable Claro designs.
 */

(($, Drupal) => {
  /**
   * Theme function for a vertical tab.
   *
   * @param {object} settings
   *   An object with the following keys:
   * @param {string} settings.title
   *   The name of the tab.
   *
   * @return {object}
   *   This function has to return an object with at least these keys:
   *   - item: The root tab jQuery element
   *   - link: The anchor tag that acts as the clickable area of the tab
   *       (jQuery version)
   *   - summary: The jQuery element that contains the tab summary
   */
  Drupal.theme.verticalTab = (settings) => {
    const tab = {};
    tab.title = $('<strong class="vertical-tabs__menu-item-title"></strong>');
    tab.title[0].textContent = settings.title;
    tab.item = $(
      '<li class="vertical-tabs__menu-item" tabindex="-1"></li>',
    ).append(
      (tab.link = $('<a href="#" class="vertical-tabs__menu-link"></a>').append(
        $('<span class="vertical-tabs__menu-link-content"></span>')
          .append(tab.title)
          .append(
            (tab.summary = $(
              '<span class="vertical-tabs__menu-link-summary"></span>',
            )),
          ),
      )),
    );
    return tab;
  };
})(jQuery, Drupal);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/themes/claro/js/vertical-tabs.js. */;
/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/misc/machine-name.js. */
/**
 * @file
 * Machine name functionality.
 */

(function ($, Drupal, drupalSettings) {
  /**
   * Attach the machine-readable name form element behavior.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches machine-name behaviors.
   */
  Drupal.behaviors.machineName = {
    /**
     * Attaches the behavior.
     *
     * @param {Element} context
     *   The context for attaching the behavior.
     * @param {object} settings
     *   Settings object.
     * @param {object} settings.machineName
     *   A list of elements to process, keyed by the HTML ID of the form
     *   element containing the human-readable value. Each element is an object
     *   defining the following properties:
     *   - target: The HTML ID of the machine name form element.
     *   - suffix: The HTML ID of a container to show the machine name preview
     *     in (usually a field suffix after the human-readable name
     *     form element).
     *   - label: The label to show for the machine name preview.
     *   - replace_pattern: A regular expression (without modifiers) matching
     *     disallowed characters in the machine name; e.g., '[^a-z0-9]+'.
     *   - replace: A character to replace disallowed characters with; e.g.,
     *     '_' or '-'.
     *   - standalone: Whether the preview should stay in its own element
     *     rather than the suffix of the source element.
     *   - field_prefix: The #field_prefix of the form element.
     *   - field_suffix: The #field_suffix of the form element.
     */
    attach(context, settings) {
      const self = this;
      const $context = $(context);
      let timeout = null;
      let xhr = null;

      function clickEditHandler(e) {
        const data = e.data;
        data.$wrapper.removeClass('visually-hidden');
        data.$target.trigger('focus');
        data.$suffix.hide();
        data.$source.off('.machineName');
      }

      function machineNameHandler(e) {
        const data = e.data;
        const options = data.options;
        const baseValue = e.target.value;

        const rx = new RegExp(options.replace_pattern, 'g');
        const expected = baseValue
          .toLowerCase()
          .replace(rx, options.replace)
          .substr(0, options.maxlength);

        // Abort the last pending request because the label has changed and it
        // is no longer valid.
        if (xhr && xhr.readystate !== 4) {
          xhr.abort();
          xhr = null;
        }

        // Wait 300 milliseconds for Ajax request since the last event to update
        // the machine name i.e., after the user has stopped typing.
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        if (baseValue.toLowerCase() !== expected) {
          timeout = setTimeout(() => {
            xhr = self.transliterate(baseValue, options).done((machine) => {
              self.showMachineName(machine.substr(0, options.maxlength), data);
            });
          }, 300);
        } else {
          self.showMachineName(expected, data);
        }
      }

      Object.keys(settings.machineName).forEach((sourceId) => {
        const options = settings.machineName[sourceId];

        const $source = $(
          once(
            'machine-name',
            $context.find(sourceId).addClass('machine-name-source'),
          ),
        );
        const $target = $context
          .find(options.target)
          .addClass('machine-name-target');
        const $suffix = $context.find(options.suffix);
        const $wrapper = $target.closest('.js-form-item');
        // All elements have to exist.
        if (
          !$source.length ||
          !$target.length ||
          !$suffix.length ||
          !$wrapper.length
        ) {
          return;
        }
        // Skip processing upon a form validation error on the machine name.
        if ($target.hasClass('error')) {
          return;
        }
        // Figure out the maximum length for the machine name.
        options.maxlength = $target.attr('maxlength');
        // Hide the form item container of the machine name form element.
        $wrapper.addClass('visually-hidden');
        // Initial machine name from the target field default value.
        const machine = $target[0].value;
        // Append the machine name preview to the source field.
        const $preview = $(
          `<span class="machine-name-value">${
            options.field_prefix
          }${Drupal.checkPlain(machine)}${options.field_suffix}</span>`,
        );
        $suffix.empty();
        if (options.label) {
          $suffix.append(
            `<span class="machine-name-label">${options.label}: </span>`,
          );
        }
        $suffix.append($preview);

        // If the machine name cannot be edited, stop further processing.
        if ($target.is(':disabled')) {
          return;
        }

        const eventData = {
          $source,
          $target,
          $suffix,
          $wrapper,
          $preview,
          options,
        };

        // If no initial value, determine machine name based on the
        // human-readable form element value.
        if (machine === '' && $source[0].value !== '') {
          self.transliterate($source[0].value, options).done((machineName) => {
            self.showMachineName(
              machineName.substr(0, options.maxlength),
              eventData,
            );
          });
        }

        // If it is editable, append an edit link.
        const $link = $(
          `<span class="admin-link"><button type="button" class="link">${Drupal.t(
            'Edit',
          )}</button></span>`,
        ).on('click', eventData, clickEditHandler);
        $suffix.append($link);

        // Preview the machine name in realtime when the human-readable name
        // changes, but only if there is no machine name yet; i.e., only upon
        // initial creation, not when editing.
        if ($target[0].value === '') {
          $source
            .on('formUpdated.machineName', eventData, machineNameHandler)
            // Initialize machine name preview.
            .trigger('formUpdated.machineName');
        }

        // Add a listener for an invalid event on the machine name input
        // to show its container and focus it.
        $target.on('invalid', eventData, clickEditHandler);
      });
    },

    showMachineName(machine, data) {
      const settings = data.options;
      // Set the machine name to the transliterated value.
      if (machine !== '') {
        if (machine !== settings.replace) {
          data.$target[0].value = machine;
          data.$preview.html(
            settings.field_prefix +
              Drupal.checkPlain(machine) +
              settings.field_suffix,
          );
        }
        data.$suffix.show();
      } else {
        data.$suffix.hide();
        data.$target[0].value = machine;
        data.$preview.empty();
      }
    },

    /**
     * Transliterate a human-readable name to a machine name.
     *
     * @param {string} source
     *   A string to transliterate.
     * @param {object} settings
     *   The machine name settings for the corresponding field.
     * @param {string} settings.replace_pattern
     *   A regular expression (without modifiers) matching disallowed characters
     *   in the machine name; e.g., '[^a-z0-9]+'.
     * @param {string} settings.replace_token
     *   A token to validate the regular expression.
     * @param {string} settings.replace
     *   A character to replace disallowed characters with; e.g., '_' or '-'.
     * @param {number} settings.maxlength
     *   The maximum length of the machine name.
     *
     * @return {jQuery}
     *   The transliterated source string.
     */
    transliterate(source, settings) {
      return $.get(Drupal.url('machine_name/transliterate'), {
        text: source,
        langcode: drupalSettings.langcode,
        replace_pattern: settings.replace_pattern,
        replace_token: settings.replace_token,
        replace: settings.replace,
        lowercase: true,
      });
    },
  };
})(jQuery, Drupal, drupalSettings);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/misc/machine-name.js. */;
/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/themes/claro/js/nav-tabs.js. */
/**
 * @file
 * Responsive navigation tabs.
 *
 * This also supports collapsible navigable is the 'is-collapsible' class is
 * added to the main element, and a target element is included.
 */
(($, Drupal) => {
  function init(tab) {
    const $tab = $(tab);
    const $target = $tab.find('[data-drupal-nav-tabs-target]');
    const $active = $target.find('.js-active-tab');

    const openMenu = () => {
      $target.toggleClass('is-open');
    };

    const toggleOrder = (reset) => {
      const current = $active.index();
      const original = $active.data('original-order');

      // Do not change order if already first or if already reset.
      if (original === 0 || reset === (current === original)) {
        return;
      }

      const siblings = {
        first: '[data-original-order="0"]',
        previous: `[data-original-order="${original - 1}"]`,
      };

      const $first = $target.find(siblings.first);
      const $previous = $target.find(siblings.previous);

      if (reset && current !== original) {
        $active.insertAfter($previous);
      } else if (!reset && current === original) {
        $active.insertBefore($first);
      }
    };

    const toggleCollapsed = () => {
      if (window.matchMedia('(min-width: 48em)').matches) {
        if ($tab.hasClass('is-horizontal') && !$tab.attr('data-width')) {
          let width = 0;

          $target.find('.js-tabs-link').each((index, value) => {
            width += $(value).outerWidth();
          });
          $tab.attr('data-width', width);
        }

        // Collapse the tabs if the combined width of the tabs is greater than
        // the width of the parent container.
        const isHorizontal = $tab.attr('data-width') <= $tab.outerWidth();
        $tab.toggleClass('is-horizontal', isHorizontal);
        toggleOrder(isHorizontal);
      } else {
        toggleOrder(false);
      }
    };

    $tab.addClass('position-container is-horizontal-enabled');

    $target.find('.js-tab').each((index, element) => {
      const $item = $(element);
      $item.attr('data-original-order', $item.index());
    });

    $tab.on('click.tabs', '[data-drupal-nav-tabs-trigger]', openMenu);
    $(window)
      // @todo use a media query event listener https://www.drupal.org/project/drupal/issues/3225621
      .on('resize.tabs', Drupal.debounce(toggleCollapsed, 150))
      .trigger('resize.tabs');
  }
  /**
   * Initialize the tabs JS.
   */
  Drupal.behaviors.navTabs = {
    attach(context) {
      once(
        'nav-tabs',
        '[data-drupal-nav-tabs].is-collapsible',
        context,
      ).forEach(init);
    },
  };
})(jQuery, Drupal);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/themes/claro/js/nav-tabs.js. */;
/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/misc/displace.js. */
/**
 * @file
 * Manages elements that can offset the size of the viewport.
 *
 * Measures and reports viewport offset dimensions from elements like the
 * toolbar that can potentially displace the positioning of other elements.
 */

/**
 * @typedef {object} Drupal~displaceOffset
 *
 * @prop {number} top
 * @prop {number} left
 * @prop {number} right
 * @prop {number} bottom
 */

/**
 * Triggers when layout of the page changes.
 *
 * This is used to position fixed element on the page during page resize and
 * Toolbar toggling.
 *
 * @event drupalViewportOffsetChange
 */
(function ($, Drupal, debounce) {
  /**
   *
   * @type {Drupal~displaceOffset}
   */
  const cache = {
    right: 0,
    left: 0,
    bottom: 0,
    top: 0,
  };
  /**
   * The prefix used for the css custom variable name.
   *
   * @type {string}
   */
  const cssVarPrefix = '--drupal-displace-offset';
  const documentStyle = document.documentElement.style;
  const offsetKeys = Object.keys(cache);
  /**
   * The object with accessors that update the CSS variable on value update.
   *
   * @type {Drupal~displaceOffset}
   */
  const offsetProps = {};
  offsetKeys.forEach((edge) => {
    offsetProps[edge] = {
      // Show this property when using Object.keys().
      enumerable: true,
      get() {
        return cache[edge];
      },
      set(value) {
        // Only update the CSS custom variable when the value changed.
        if (value !== cache[edge]) {
          documentStyle.setProperty(`${cssVarPrefix}-${edge}`, `${value}px`);
        }
        cache[edge] = value;
      },
    };
  });

  /**
   * Current value of the size of margins on the page.
   *
   * This property is read-only and the object is sealed to prevent key name
   * modifications since key names are used to dynamically construct CSS custom
   * variable names.
   *
   * @name Drupal.displace.offsets
   *
   * @type {Drupal~displaceOffset}
   */
  const offsets = Object.seal(Object.defineProperties({}, offsetProps));

  /**
   * Calculates displacement for element based on its dimensions and placement.
   *
   * @param {HTMLElement} el
   *   The element whose dimensions and placement will be measured.
   *
   * @param {string} edge
   *   The name of the edge of the viewport that the element is associated
   *   with.
   *
   * @return {number}
   *   The viewport displacement distance for the requested edge.
   */
  function getRawOffset(el, edge) {
    const $el = $(el);
    const documentElement = document.documentElement;
    let displacement = 0;
    const horizontal = edge === 'left' || edge === 'right';
    // Get the offset of the element itself.
    let placement = $el.offset()[horizontal ? 'left' : 'top'];
    // Subtract scroll distance from placement to get the distance
    // to the edge of the viewport.
    placement -=
      window[`scroll${horizontal ? 'X' : 'Y'}`] ||
      document.documentElement[`scroll${horizontal ? 'Left' : 'Top'}`] ||
      0;
    // Find the displacement value according to the edge.
    switch (edge) {
      // Left and top elements displace as a sum of their own offset value
      // plus their size.
      case 'top':
        // Total displacement is the sum of the elements placement and size.
        displacement = placement + $el.outerHeight();
        break;

      case 'left':
        // Total displacement is the sum of the elements placement and size.
        displacement = placement + $el.outerWidth();
        break;

      // Right and bottom elements displace according to their left and
      // top offset. Their size isn't important.
      case 'bottom':
        displacement = documentElement.clientHeight - placement;
        break;

      case 'right':
        displacement = documentElement.clientWidth - placement;
        break;

      default:
        displacement = 0;
    }
    return displacement;
  }

  /**
   * Gets a specific edge's offset.
   *
   * Any element with the attribute data-offset-{edge} e.g. data-offset-top will
   * be considered in the viewport offset calculations. If the attribute has a
   * numeric value, that value will be used. If no value is provided, one will
   * be calculated using the element's dimensions and placement.
   *
   * @function Drupal.displace.calculateOffset
   *
   * @param {string} edge
   *   The name of the edge to calculate. Can be 'top', 'right',
   *   'bottom' or 'left'.
   *
   * @return {number}
   *   The viewport displacement distance for the requested edge.
   */
  function calculateOffset(edge) {
    let edgeOffset = 0;
    const displacingElements = document.querySelectorAll(
      `[data-offset-${edge}]`,
    );
    const n = displacingElements.length;
    for (let i = 0; i < n; i++) {
      const el = displacingElements[i];
      // If the element is not visible, do consider its dimensions.
      if (el.style.display === 'none') {
        continue;
      }
      // If the offset data attribute contains a displacing value, use it.
      let displacement = parseInt(el.getAttribute(`data-offset-${edge}`), 10);
      // If the element's offset data attribute exits
      // but is not a valid number then get the displacement
      // dimensions directly from the element.
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(displacement)) {
        displacement = getRawOffset(el, edge);
      }
      // If the displacement value is larger than the current value for this
      // edge, use the displacement value.
      edgeOffset = Math.max(edgeOffset, displacement);
    }

    return edgeOffset;
  }

  /**
   * Informs listeners of the current offset dimensions.
   *
   * Corresponding CSS custom variables are also updated.
   * Corresponding CSS custom variables names are:
   *  - `--drupal-displace-offset-top`
   *  - `--drupal-displace-offset-right`
   *  - `--drupal-displace-offset-bottom`
   *  - `--drupal-displace-offset-left`
   *
   * @function Drupal.displace
   *
   * @prop {Drupal~displaceOffset} offsets
   *
   * @param {boolean} [broadcast=true]
   *   When true, causes the recalculated offsets values to be
   *   broadcast to listeners. If none is given, defaults to true.
   *
   * @return {Drupal~displaceOffset}
   *   An object whose keys are the for sides an element -- top, right, bottom
   *   and left. The value of each key is the viewport displacement distance for
   *   that edge.
   *
   * @fires event:drupalViewportOffsetChange
   */
  function displace(broadcast = true) {
    const newOffsets = {};
    // Getting the offset and setting the offset needs to be separated because
    // of performance concerns. Only do DOM/style reading happening here.
    offsetKeys.forEach((edge) => {
      newOffsets[edge] = calculateOffset(edge);
    });
    // Once we have all the values, write to the DOM/style.
    offsetKeys.forEach((edge) => {
      // Updating the value in place also update Drupal.displace.offsets.
      offsets[edge] = newOffsets[edge];
    });

    if (broadcast) {
      $(document).trigger('drupalViewportOffsetChange', offsets);
    }
    return offsets;
  }

  /**
   * Registers a resize handler on the window.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.drupalDisplace = {
    attach() {
      // Mark this behavior as processed on the first pass.
      if (this.displaceProcessed) {
        return;
      }
      this.displaceProcessed = true;
      $(window).on('resize.drupalDisplace', debounce(displace, 200));
    },
  };

  /**
   * Assign the displace function to a property of the Drupal global object.
   *
   * @ignore
   */
  Drupal.displace = displace;

  /**
   * Expose offsets to other scripts to avoid having to recalculate offsets.
   *
   * @ignore
   */
  Object.defineProperty(Drupal.displace, 'offsets', {
    value: offsets,
    // Make sure other scripts don't replace this object.
    writable: false,
  });

  /**
   * Expose method to compute a single edge offsets.
   *
   * @ignore
   */
  Drupal.displace.calculateOffset = calculateOffset;
})(jQuery, Drupal, Drupal.debounce);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/misc/displace.js. */;
/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/modules/toolbar/js/toolbar.menu.js. */
/**
 * @file
 * Builds a nested accordion widget.
 *
 * Invoke on an HTML list element with the jQuery plugin pattern.
 *
 * @example
 * $('.toolbar-menu').drupalToolbarMenu();
 */

(function ($, Drupal, drupalSettings) {
  /**
   * Store the open menu tray.
   */
  let activeItem = Drupal.url(drupalSettings.path.currentPath);

  $.fn.drupalToolbarMenu = function () {
    const ui = {
      handleOpen: Drupal.t('Extend'),
      handleClose: Drupal.t('Collapse'),
    };

    /**
     * Toggle the open/close state of a list is a menu.
     *
     * @param {jQuery} $item
     *   The li item to be toggled.
     *
     * @param {Boolean} switcher
     *   A flag that forces toggleClass to add or a remove a class, rather than
     *   simply toggling its presence.
     */
    function toggleList($item, switcher) {
      const $toggle = $item
        .children('.toolbar-box')
        .children('.toolbar-handle');
      switcher =
        typeof switcher !== 'undefined' ? switcher : !$item.hasClass('open');
      // Toggle the item open state.
      $item.toggleClass('open', switcher);
      // Twist the toggle.
      $toggle.toggleClass('open', switcher);
      // Adjust the toggle text.
      $toggle.find('.action').each((index, element) => {
        // Expand Structure, Collapse Structure.
        element.textContent = switcher ? ui.handleClose : ui.handleOpen;
      });
    }

    /**
     * Handle clicks from the disclosure button on an item with sub-items.
     *
     * @param {Object} event
     *   A jQuery Event object.
     */
    function toggleClickHandler(event) {
      const $toggle = $(event.target);
      const $item = $toggle.closest('li');
      // Toggle the list item.
      toggleList($item);
      // Close open sibling menus.
      const $openItems = $item.siblings().filter('.open');
      toggleList($openItems, false);
    }

    /**
     * Handle clicks from a menu item link.
     *
     * @param {Object} event
     *   A jQuery Event object.
     */
    function linkClickHandler(event) {
      // If the toolbar is positioned fixed (and therefore hiding content
      // underneath), then users expect clicks in the administration menu tray
      // to take them to that destination but for the menu tray to be closed
      // after clicking: otherwise the toolbar itself is obstructing the view
      // of the destination they chose.
      if (!Drupal.toolbar.models.toolbarModel.get('isFixed')) {
        Drupal.toolbar.models.toolbarModel.set('activeTab', null);
      }
      // Stopping propagation to make sure that once a toolbar-box is clicked
      // (the whitespace part), the page is not redirected anymore.
      event.stopPropagation();
    }

    /**
     * Add markup to the menu elements.
     *
     * Items with sub-elements have a list toggle attached to them. Menu item
     * links and the corresponding list toggle are wrapped with in a div
     * classed with .toolbar-box. The .toolbar-box div provides a positioning
     * context for the item list toggle.
     *
     * @param {jQuery} $menu
     *   The root of the menu to be initialized.
     */
    function initItems($menu) {
      const options = {
        class: 'toolbar-icon toolbar-handle',
        action: ui.handleOpen,
        text: '',
      };
      // Initialize items and their links.
      $menu.find('li > a').wrap('<div class="toolbar-box">');
      // Add a handle to each list item if it has a menu.
      $menu.find('li').each((index, element) => {
        const $item = $(element);
        if ($item.children('ul.toolbar-menu').length) {
          const $box = $item.children('.toolbar-box');
          const $link = $box.find('a');
          options.text = Drupal.t('@label', {
            '@label': $link.length ? $link[0].textContent : '',
          });
          $item
            .children('.toolbar-box')
            .append(Drupal.theme('toolbarMenuItemToggle', options));
        }
      });
    }

    /**
     * Adds a level class to each list based on its depth in the menu.
     *
     * This function is called recursively on each sub level of lists elements
     * until the depth of the menu is exhausted.
     *
     * @param {jQuery} $lists
     *   A jQuery object of ul elements.
     *
     * @param {number} level
     *   The current level number to be assigned to the list elements.
     */
    function markListLevels($lists, level) {
      level = !level ? 1 : level;
      const $lis = $lists.children('li').addClass(`level-${level}`);
      $lists = $lis.children('ul');
      if ($lists.length) {
        markListLevels($lists, level + 1);
      }
    }

    /**
     * On page load, open the active menu item.
     *
     * Marks the trail of the active link in the menu back to the root of the
     * menu with .menu-item--active-trail.
     *
     * @param {jQuery} $menu
     *   The root of the menu.
     */
    function openActiveItem($menu) {
      const pathItem = $menu.find(`a[href="${window.location.pathname}"]`);
      if (pathItem.length && !activeItem) {
        activeItem = window.location.pathname;
      }
      if (activeItem) {
        const $activeItem = $menu
          .find(`a[href="${activeItem}"]`)
          .addClass('menu-item--active');
        const $activeTrail = $activeItem
          .parentsUntil('.root', 'li')
          .addClass('menu-item--active-trail');
        toggleList($activeTrail, true);
      }
    }

    // Return the jQuery object.
    return this.each(function (selector) {
      const menu = once('toolbar-menu', this);
      if (menu.length) {
        const $menu = $(menu);
        // Bind event handlers.
        $menu
          .on('click.toolbar', '.toolbar-box', toggleClickHandler)
          .on('click.toolbar', '.toolbar-box a', linkClickHandler);

        $menu.addClass('root');
        initItems($menu);
        markListLevels($menu);
        // Restore previous and active states.
        openActiveItem($menu);
      }
    });
  };

  /**
   * A toggle is an interactive element often bound to a click handler.
   *
   * @param {object} options
   *   Options for the button.
   * @param {string} options.class
   *   Class to set on the button.
   * @param {string} options.action
   *   Action for the button.
   * @param {string} options.text
   *   Used as label for the button.
   *
   * @return {string}
   *   A string representing a DOM fragment.
   */
  Drupal.theme.toolbarMenuItemToggle = function (options) {
    return `<button class="${options.class}"><span class="action">${options.action}</span> <span class="label">${options.text}</span></button>`;
  };
})(jQuery, Drupal, drupalSettings);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/modules/toolbar/js/toolbar.menu.js. */;
/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/modules/toolbar/js/toolbar.js. */
/**
 * @file
 * Defines the behavior of the Drupal administration toolbar.
 */

(function ($, Drupal, drupalSettings) {
  // Merge run-time settings with the defaults.
  const options = $.extend(
    {
      breakpoints: {
        'toolbar.narrow': '',
        'toolbar.standard': '',
        'toolbar.wide': '',
      },
    },
    drupalSettings.toolbar,
    // Merge strings on top of drupalSettings so that they are not mutable.
    {
      strings: {
        horizontal: Drupal.t('Horizontal orientation'),
        vertical: Drupal.t('Vertical orientation'),
      },
    },
  );

  /**
   * Registers tabs with the toolbar.
   *
   * The Drupal toolbar allows modules to register top-level tabs. These may
   * point directly to a resource or toggle the visibility of a tray.
   *
   * Modules register tabs with hook_toolbar().
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches the toolbar rendering functionality to the toolbar element.
   */
  Drupal.behaviors.toolbar = {
    attach(context) {
      // Verify that the user agent understands media queries. Complex admin
      // toolbar layouts require media query support.
      if (!window.matchMedia('only screen').matches) {
        return;
      }
      // Process the administrative toolbar.
      once('toolbar', '#toolbar-administration', context).forEach((toolbar) => {
        // Establish the toolbar models and views.
        const model = new Drupal.toolbar.ToolbarModel({
          locked: JSON.parse(
            localStorage.getItem('Drupal.toolbar.trayVerticalLocked'),
          ),
          activeTab: document.getElementById(
            JSON.parse(localStorage.getItem('Drupal.toolbar.activeTabID')),
          ),
          height: $('#toolbar-administration').outerHeight(),
        });

        Drupal.toolbar.models.toolbarModel = model;

        // Attach a listener to the configured media query breakpoints.
        // Executes it before Drupal.toolbar.views to avoid extra rendering.
        Object.keys(options.breakpoints).forEach((label) => {
          const mq = options.breakpoints[label];
          const mql = window.matchMedia(mq);
          Drupal.toolbar.mql[label] = mql;
          // Curry the model and the label of the media query breakpoint to
          // the mediaQueryChangeHandler function.
          mql.addListener(
            Drupal.toolbar.mediaQueryChangeHandler.bind(null, model, label),
          );
          // Fire the mediaQueryChangeHandler for each configured breakpoint
          // so that they process once.
          Drupal.toolbar.mediaQueryChangeHandler.call(null, model, label, mql);
        });

        Drupal.toolbar.views.toolbarVisualView =
          new Drupal.toolbar.ToolbarVisualView({
            el: toolbar,
            model,
            strings: options.strings,
          });
        Drupal.toolbar.views.toolbarAuralView =
          new Drupal.toolbar.ToolbarAuralView({
            el: toolbar,
            model,
            strings: options.strings,
          });
        Drupal.toolbar.views.bodyVisualView = new Drupal.toolbar.BodyVisualView(
          {
            el: toolbar,
            model,
          },
        );

        // Force layout render to fix mobile view. Only needed on load, not
        // for every media query match.
        model.trigger('change:isFixed', model, model.get('isFixed'));
        model.trigger('change:activeTray', model, model.get('activeTray'));

        // Render collapsible menus.
        const menuModel = new Drupal.toolbar.MenuModel();
        Drupal.toolbar.models.menuModel = menuModel;
        Drupal.toolbar.views.menuVisualView = new Drupal.toolbar.MenuVisualView(
          {
            el: $(toolbar).find('.toolbar-menu-administration').get(0),
            model: menuModel,
            strings: options.strings,
          },
        );

        // Handle the resolution of Drupal.toolbar.setSubtrees.
        // This is handled with a deferred so that the function may be invoked
        // asynchronously.
        Drupal.toolbar.setSubtrees.done((subtrees) => {
          menuModel.set('subtrees', subtrees);
          const theme = drupalSettings.ajaxPageState.theme;
          localStorage.setItem(
            `Drupal.toolbar.subtrees.${theme}`,
            JSON.stringify(subtrees),
          );
          // Indicate on the toolbarModel that subtrees are now loaded.
          model.set('areSubtreesLoaded', true);
        });

        // Trigger an initial attempt to load menu subitems. This first attempt
        // is made after the media query handlers have had an opportunity to
        // process. The toolbar starts in the vertical orientation by default,
        // unless the viewport is wide enough to accommodate a horizontal
        // orientation. Thus we give the Toolbar a chance to determine if it
        // should be set to horizontal orientation before attempting to load
        // menu subtrees.
        Drupal.toolbar.views.toolbarVisualView.loadSubtrees();

        $(document)
          // Update the model when the viewport offset changes.
          .on('drupalViewportOffsetChange.toolbar', (event, offsets) => {
            model.set('offsets', offsets);
          });

        // Broadcast model changes to other modules.
        model
          .on('change:orientation', (model, orientation) => {
            $(document).trigger('drupalToolbarOrientationChange', orientation);
          })
          .on('change:activeTab', (model, tab) => {
            $(document).trigger('drupalToolbarTabChange', tab);
          })
          .on('change:activeTray', (model, tray) => {
            $(document).trigger('drupalToolbarTrayChange', tray);
          });

        // If the toolbar's orientation is horizontal and no active tab is
        // defined then show the tray of the first toolbar tab by default (but
        // not the first 'Home' toolbar tab).
        if (
          Drupal.toolbar.models.toolbarModel.get('orientation') ===
            'horizontal' &&
          Drupal.toolbar.models.toolbarModel.get('activeTab') === null
        ) {
          Drupal.toolbar.models.toolbarModel.set({
            activeTab: $(
              '.toolbar-bar .toolbar-tab:not(.home-toolbar-tab) a',
            ).get(0),
          });
        }

        $(window).on({
          'dialog:aftercreate': (event, dialog, $element, settings) => {
            const $toolbar = $('#toolbar-bar');
            $toolbar.css('margin-top', '0');

            // When off-canvas is positioned in top, toolbar has to be moved down.
            if (settings.drupalOffCanvasPosition === 'top') {
              const height = Drupal.offCanvas
                .getContainer($element)
                .outerHeight();
              $toolbar.css('margin-top', `${height}px`);

              $element.on('dialogContentResize.off-canvas', () => {
                const newHeight = Drupal.offCanvas
                  .getContainer($element)
                  .outerHeight();
                $toolbar.css('margin-top', `${newHeight}px`);
              });
            }
          },
          'dialog:beforeclose': () => {
            $('#toolbar-bar').css('margin-top', '0');
          },
        });
      });
    },
  };

  /**
   * Toolbar methods of Backbone objects.
   *
   * @namespace
   */
  Drupal.toolbar = {
    /**
     * A hash of View instances.
     *
     * @type {object.<string, Backbone.View>}
     */
    views: {},

    /**
     * A hash of Model instances.
     *
     * @type {object.<string, Backbone.Model>}
     */
    models: {},

    /**
     * A hash of MediaQueryList objects tracked by the toolbar.
     *
     * @type {object.<string, object>}
     */
    mql: {},

    /**
     * Accepts a list of subtree menu elements.
     *
     * A deferred object that is resolved by an inlined JavaScript callback.
     *
     * @type {jQuery.Deferred}
     *
     * @see toolbar_subtrees_jsonp().
     */
    setSubtrees: new $.Deferred(),

    /**
     * Respond to configured narrow media query changes.
     *
     * @param {Drupal.toolbar.ToolbarModel} model
     *   A toolbar model
     * @param {string} label
     *   Media query label.
     * @param {object} mql
     *   A MediaQueryList object.
     */
    mediaQueryChangeHandler(model, label, mql) {
      switch (label) {
        case 'toolbar.narrow':
          model.set({
            isOriented: mql.matches,
            isTrayToggleVisible: false,
          });
          // If the toolbar doesn't have an explicit orientation yet, or if the
          // narrow media query doesn't match then set the orientation to
          // vertical.
          if (!mql.matches || !model.get('orientation')) {
            model.set({ orientation: 'vertical' }, { validate: true });
          }
          break;

        case 'toolbar.standard':
          model.set({
            isFixed: mql.matches,
          });
          break;

        case 'toolbar.wide':
          model.set(
            {
              orientation:
                mql.matches && !model.get('locked') ? 'horizontal' : 'vertical',
            },
            { validate: true },
          );
          // The tray orientation toggle visibility does not need to be
          // validated.
          model.set({
            isTrayToggleVisible: mql.matches,
          });
          break;

        default:
          break;
      }
    },
  };

  /**
   * A toggle is an interactive element often bound to a click handler.
   *
   * @return {string}
   *   A string representing a DOM fragment.
   */
  Drupal.theme.toolbarOrientationToggle = function () {
    return (
      '<div class="toolbar-toggle-orientation"><div class="toolbar-lining">' +
      '<button class="toolbar-icon" type="button"></button>' +
      '</div></div>'
    );
  };

  /**
   * Ajax command to set the toolbar subtrees.
   *
   * @param {Drupal.Ajax} ajax
   *   {@link Drupal.Ajax} object created by {@link Drupal.ajax}.
   * @param {object} response
   *   JSON response from the Ajax request.
   * @param {number} [status]
   *   XMLHttpRequest status.
   */
  Drupal.AjaxCommands.prototype.setToolbarSubtrees = function (
    ajax,
    response,
    status,
  ) {
    Drupal.toolbar.setSubtrees.resolve(response.subtrees);
  };
})(jQuery, Drupal, drupalSettings);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/modules/toolbar/js/toolbar.js. */;
/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/modules/toolbar/js/models/MenuModel.js. */
/**
 * @file
 * A Backbone Model for collapsible menus.
 */

(function (Backbone, Drupal) {
  /**
   * Backbone Model for collapsible menus.
   *
   * @constructor
   *
   * @augments Backbone.Model
   */
  Drupal.toolbar.MenuModel = Backbone.Model.extend(
    /** @lends Drupal.toolbar.MenuModel# */ {
      /**
       * @type {object}
       *
       * @prop {object} subtrees
       */
      defaults: /** @lends Drupal.toolbar.MenuModel# */ {
        /**
         * @type {object}
         */
        subtrees: {},
      },
    },
  );
})(Backbone, Drupal);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/modules/toolbar/js/models/MenuModel.js. */;
/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/modules/toolbar/js/models/ToolbarModel.js. */
/**
 * @file
 * A Backbone Model for the toolbar.
 */

(function (Backbone, Drupal) {
  /**
   * Backbone model for the toolbar.
   *
   * @constructor
   *
   * @augments Backbone.Model
   */
  Drupal.toolbar.ToolbarModel = Backbone.Model.extend(
    /** @lends Drupal.toolbar.ToolbarModel# */ {
      /**
       * @type {object}
       *
       * @prop activeTab
       * @prop activeTray
       * @prop isOriented
       * @prop isFixed
       * @prop areSubtreesLoaded
       * @prop isViewportOverflowConstrained
       * @prop orientation
       * @prop locked
       * @prop isTrayToggleVisible
       * @prop height
       * @prop offsets
       */
      defaults: /** @lends Drupal.toolbar.ToolbarModel# */ {
        /**
         * The active toolbar tab. All other tabs should be inactive under
         * normal circumstances. It will remain active across page loads. The
         * active item is stored as an ID selector e.g. '#toolbar-item--1'.
         *
         * @type {string}
         */
        activeTab: null,

        /**
         * Represents whether a tray is open or not. Stored as an ID selector e.g.
         * '#toolbar-item--1-tray'.
         *
         * @type {string}
         */
        activeTray: null,

        /**
         * Indicates whether the toolbar is displayed in an oriented fashion,
         * either horizontal or vertical.
         *
         * @type {boolean}
         */
        isOriented: false,

        /**
         * Indicates whether the toolbar is positioned absolute (false) or fixed
         * (true).
         *
         * @type {boolean}
         */
        isFixed: false,

        /**
         * Menu subtrees are loaded through an AJAX request only when the Toolbar
         * is set to a vertical orientation.
         *
         * @type {boolean}
         */
        areSubtreesLoaded: false,

        /**
         * If the viewport overflow becomes constrained, isFixed must be true so
         * that elements in the trays aren't lost off-screen and impossible to
         * get to.
         *
         * @type {boolean}
         */
        isViewportOverflowConstrained: false,

        /**
         * The orientation of the active tray.
         *
         * @type {string}
         */
        orientation: 'horizontal',

        /**
         * A tray is locked if a user toggled it to vertical. Otherwise a tray
         * will switch between vertical and horizontal orientation based on the
         * configured breakpoints. The locked state will be maintained across page
         * loads.
         *
         * @type {boolean}
         */
        locked: false,

        /**
         * Indicates whether the tray orientation toggle is visible.
         *
         * @type {boolean}
         */
        isTrayToggleVisible: true,

        /**
         * The height of the toolbar.
         *
         * @type {number}
         */
        height: null,

        /**
         * The current viewport offsets determined by {@link Drupal.displace}. The
         * offsets suggest how a module might position is components relative to
         * the viewport.
         *
         * @type {object}
         *
         * @prop {number} top
         * @prop {number} right
         * @prop {number} bottom
         * @prop {number} left
         */
        offsets: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },

      /**
       * {@inheritdoc}
       *
       * @param {object} attributes
       *   Attributes for the toolbar.
       * @param {object} options
       *   Options for the toolbar.
       *
       * @return {string|undefined}
       *   Returns an error message if validation failed.
       */
      validate(attributes, options) {
        // Prevent the orientation being set to horizontal if it is locked, unless
        // override has not been passed as an option.
        if (
          attributes.orientation === 'horizontal' &&
          this.get('locked') &&
          !options.override
        ) {
          return Drupal.t(
            'The toolbar cannot be set to a horizontal orientation when it is locked.',
          );
        }
      },
    },
  );
})(Backbone, Drupal);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/modules/toolbar/js/models/ToolbarModel.js. */;
/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/modules/toolbar/js/views/BodyVisualView.js. */
/**
 * @file
 * A Backbone view for the body element.
 */

(function ($, Drupal, Backbone) {
  Drupal.toolbar.BodyVisualView = Backbone.View.extend(
    /** @lends Drupal.toolbar.BodyVisualView# */ {
      /**
       * Adjusts the body element with the toolbar position and dimension changes.
       *
       * @constructs
       *
       * @augments Backbone.View
       */
      initialize() {
        this.listenTo(this.model, 'change:activeTray ', this.render);
        this.listenTo(
          this.model,
          'change:isFixed change:isViewportOverflowConstrained',
          this.isToolbarFixed,
        );
      },

      isToolbarFixed() {
        // When the toolbar is fixed, it will not scroll with page scrolling.
        const isViewportOverflowConstrained = this.model.get(
          'isViewportOverflowConstrained',
        );
        $('body').toggleClass(
          'toolbar-fixed',
          isViewportOverflowConstrained || this.model.get('isFixed'),
        );
      },

      /**
       * {@inheritdoc}
       */
      render() {
        $('body')
          // Toggle the toolbar-tray-open class on the body element. The class is
          // applied when a toolbar tray is active. Padding might be applied to
          // the body element to prevent the tray from overlapping content.
          .toggleClass('toolbar-tray-open', !!this.model.get('activeTray'));
      },
    },
  );
})(jQuery, Drupal, Backbone);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/modules/toolbar/js/views/BodyVisualView.js. */;
/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/modules/toolbar/js/views/MenuVisualView.js. */
/**
 * @file
 * A Backbone view for the collapsible menus.
 */

(function ($, Backbone, Drupal) {
  Drupal.toolbar.MenuVisualView = Backbone.View.extend(
    /** @lends Drupal.toolbar.MenuVisualView# */ {
      /**
       * Backbone View for collapsible menus.
       *
       * @constructs
       *
       * @augments Backbone.View
       */
      initialize() {
        this.listenTo(this.model, 'change:subtrees', this.render);
      },

      /**
       * {@inheritdoc}
       */
      render() {
        const subtrees = this.model.get('subtrees');
        // Add subtrees.
        Object.keys(subtrees || {}).forEach((id) => {
          $(
            once('toolbar-subtrees', this.$el.find(`#toolbar-link-${id}`)),
          ).after(subtrees[id]);
        });
        // Render the main menu as a nested, collapsible accordion.
        if ('drupalToolbarMenu' in $.fn) {
          this.$el.children('.toolbar-menu').drupalToolbarMenu();
        }
      },
    },
  );
})(jQuery, Backbone, Drupal);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/modules/toolbar/js/views/MenuVisualView.js. */;
/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/modules/toolbar/js/views/ToolbarAuralView.js. */
/**
 * @file
 * A Backbone view for the aural feedback of the toolbar.
 */

(function (Backbone, Drupal) {
  Drupal.toolbar.ToolbarAuralView = Backbone.View.extend(
    /** @lends Drupal.toolbar.ToolbarAuralView# */ {
      /**
       * Backbone view for the aural feedback of the toolbar.
       *
       * @constructs
       *
       * @augments Backbone.View
       *
       * @param {object} options
       *   Options for the view.
       * @param {object} options.strings
       *   Various strings to use in the view.
       */
      initialize(options) {
        this.strings = options.strings;

        this.listenTo(
          this.model,
          'change:orientation',
          this.onOrientationChange,
        );
        this.listenTo(this.model, 'change:activeTray', this.onActiveTrayChange);
      },

      /**
       * Announces an orientation change.
       *
       * @param {Drupal.toolbar.ToolbarModel} model
       *   The toolbar model in question.
       * @param {string} orientation
       *   The new value of the orientation attribute in the model.
       */
      onOrientationChange(model, orientation) {
        Drupal.announce(
          Drupal.t('Tray orientation changed to @orientation.', {
            '@orientation': orientation,
          }),
        );
      },

      /**
       * Announces a changed active tray.
       *
       * @param {Drupal.toolbar.ToolbarModel} model
       *   The toolbar model in question.
       * @param {HTMLElement} tray
       *   The new value of the tray attribute in the model.
       */
      onActiveTrayChange(model, tray) {
        const relevantTray =
          tray === null ? model.previous('activeTray') : tray;
        // Current activeTray and previous activeTray are empty, no state change
        // to announce.
        if (!relevantTray) {
          return;
        }
        const action = tray === null ? Drupal.t('closed') : Drupal.t('opened');
        const trayNameElement =
          relevantTray.querySelector('.toolbar-tray-name');
        let text;
        if (trayNameElement !== null) {
          text = Drupal.t('Tray "@tray" @action.', {
            '@tray': trayNameElement.textContent,
            '@action': action,
          });
        } else {
          text = Drupal.t('Tray @action.', { '@action': action });
        }
        Drupal.announce(text);
      },
    },
  );
})(Backbone, Drupal);

/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/modules/toolbar/js/views/ToolbarAuralView.js. */;
