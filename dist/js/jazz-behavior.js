(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.jazz = {}));
})(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    // Public: Create a new SelectorSet.
    function SelectorSet() {
      // Construct new SelectorSet if called as a function.
      if (!(this instanceof SelectorSet)) {
        return new SelectorSet();
      }

      // Public: Number of selectors added to the set
      this.size = 0;

      // Internal: Incrementing ID counter
      this.uid = 0;

      // Internal: Array of String selectors in the set
      this.selectors = [];

      // Internal: Map of selector ids to objects
      this.selectorObjects = {};

      // Internal: All Object index String names mapping to Index objects.
      this.indexes = Object.create(this.indexes);

      // Internal: Used Object index String names mapping to Index objects.
      this.activeIndexes = [];
    }

    // Detect prefixed Element#matches function.
    var docElem = window.document.documentElement;
    var matches$1 =
      docElem.matches ||
      docElem.webkitMatchesSelector ||
      docElem.mozMatchesSelector ||
      docElem.oMatchesSelector ||
      docElem.msMatchesSelector;

    // Public: Check if element matches selector.
    //
    // Maybe overridden with custom Element.matches function.
    //
    // el       - An Element
    // selector - String CSS selector
    //
    // Returns true or false.
    SelectorSet.prototype.matchesSelector = function(el, selector) {
      return matches$1.call(el, selector);
    };

    // Public: Find all elements in the context that match the selector.
    //
    // Maybe overridden with custom querySelectorAll function.
    //
    // selectors - String CSS selectors.
    // context   - Element context
    //
    // Returns non-live list of Elements.
    SelectorSet.prototype.querySelectorAll = function(selectors, context) {
      return context.querySelectorAll(selectors);
    };

    // Public: Array of indexes.
    //
    // name     - Unique String name
    // selector - Function that takes a String selector and returns a String key
    //            or undefined if it can't be used by the index.
    // element  - Function that takes an Element and returns an Array of String
    //            keys that point to indexed values.
    //
    SelectorSet.prototype.indexes = [];

    // Index by element id
    var idRe = /^#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;
    SelectorSet.prototype.indexes.push({
      name: 'ID',
      selector: function matchIdSelector(sel) {
        var m;
        if ((m = sel.match(idRe))) {
          return m[0].slice(1);
        }
      },
      element: function getElementId(el) {
        if (el.id) {
          return [el.id];
        }
      }
    });

    // Index by all of its class names
    var classRe = /^\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;
    SelectorSet.prototype.indexes.push({
      name: 'CLASS',
      selector: function matchClassSelector(sel) {
        var m;
        if ((m = sel.match(classRe))) {
          return m[0].slice(1);
        }
      },
      element: function getElementClassNames(el) {
        var className = el.className;
        if (className) {
          if (typeof className === 'string') {
            return className.split(/\s/);
          } else if (typeof className === 'object' && 'baseVal' in className) {
            // className is a SVGAnimatedString
            // global SVGAnimatedString is not an exposed global in Opera 12
            return className.baseVal.split(/\s/);
          }
        }
      }
    });

    // Index by tag/node name: `DIV`, `FORM`, `A`
    var tagRe = /^((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;
    SelectorSet.prototype.indexes.push({
      name: 'TAG',
      selector: function matchTagSelector(sel) {
        var m;
        if ((m = sel.match(tagRe))) {
          return m[0].toUpperCase();
        }
      },
      element: function getElementTagName(el) {
        return [el.nodeName.toUpperCase()];
      }
    });

    // Default index just contains a single array of elements.
    SelectorSet.prototype.indexes['default'] = {
      name: 'UNIVERSAL',
      selector: function() {
        return true;
      },
      element: function() {
        return [true];
      }
    };

    // Use ES Maps when supported
    var Map;
    if (typeof window.Map === 'function') {
      Map = window.Map;
    } else {
      Map = (function() {
        function Map() {
          this.map = {};
        }
        Map.prototype.get = function(key) {
          return this.map[key + ' '];
        };
        Map.prototype.set = function(key, value) {
          this.map[key + ' '] = value;
        };
        return Map;
      })();
    }

    // Regexps adopted from Sizzle
    //   https://github.com/jquery/sizzle/blob/1.7/sizzle.js
    //
    var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g;

    // Internal: Get indexes for selector.
    //
    // selector - String CSS selector
    //
    // Returns Array of {index, key}.
    function parseSelectorIndexes(allIndexes, selector) {
      allIndexes = allIndexes.slice(0).concat(allIndexes['default']);

      var allIndexesLen = allIndexes.length,
        i,
        j,
        m,
        dup,
        rest = selector,
        key,
        index,
        indexes = [];

      do {
        chunker.exec('');
        if ((m = chunker.exec(rest))) {
          rest = m[3];
          if (m[2] || !rest) {
            for (i = 0; i < allIndexesLen; i++) {
              index = allIndexes[i];
              if ((key = index.selector(m[1]))) {
                j = indexes.length;
                dup = false;
                while (j--) {
                  if (indexes[j].index === index && indexes[j].key === key) {
                    dup = true;
                    break;
                  }
                }
                if (!dup) {
                  indexes.push({ index: index, key: key });
                }
                break;
              }
            }
          }
        }
      } while (m);

      return indexes;
    }

    // Internal: Find first item in Array that is a prototype of `proto`.
    //
    // ary   - Array of objects
    // proto - Prototype of expected item in `ary`
    //
    // Returns object from `ary` if found. Otherwise returns undefined.
    function findByPrototype(ary, proto) {
      var i, len, item;
      for (i = 0, len = ary.length; i < len; i++) {
        item = ary[i];
        if (proto.isPrototypeOf(item)) {
          return item;
        }
      }
    }

    // Public: Log when added selector falls under the default index.
    //
    // This API should not be considered stable. May change between
    // minor versions.
    //
    // obj - {selector, data} Object
    //
    //   SelectorSet.prototype.logDefaultIndexUsed = function(obj) {
    //     console.warn(obj.selector, "could not be indexed");
    //   };
    //
    // Returns nothing.
    SelectorSet.prototype.logDefaultIndexUsed = function() {};

    // Public: Add selector to set.
    //
    // selector - String CSS selector
    // data     - Optional data Object (default: undefined)
    //
    // Returns nothing.
    SelectorSet.prototype.add = function(selector, data) {
      var obj,
        i,
        indexProto,
        key,
        index,
        objs,
        selectorIndexes,
        selectorIndex,
        indexes = this.activeIndexes,
        selectors = this.selectors,
        selectorObjects = this.selectorObjects;

      if (typeof selector !== 'string') {
        return;
      }

      obj = {
        id: this.uid++,
        selector: selector,
        data: data
      };
      selectorObjects[obj.id] = obj;

      selectorIndexes = parseSelectorIndexes(this.indexes, selector);
      for (i = 0; i < selectorIndexes.length; i++) {
        selectorIndex = selectorIndexes[i];
        key = selectorIndex.key;
        indexProto = selectorIndex.index;

        index = findByPrototype(indexes, indexProto);
        if (!index) {
          index = Object.create(indexProto);
          index.map = new Map();
          indexes.push(index);
        }

        if (indexProto === this.indexes['default']) {
          this.logDefaultIndexUsed(obj);
        }
        objs = index.map.get(key);
        if (!objs) {
          objs = [];
          index.map.set(key, objs);
        }
        objs.push(obj);
      }

      this.size++;
      selectors.push(selector);
    };

    // Public: Remove selector from set.
    //
    // selector - String CSS selector
    // data     - Optional data Object (default: undefined)
    //
    // Returns nothing.
    SelectorSet.prototype.remove = function(selector, data) {
      if (typeof selector !== 'string') {
        return;
      }

      var selectorIndexes,
        selectorIndex,
        i,
        j,
        k,
        selIndex,
        objs,
        obj,
        indexes = this.activeIndexes,
        selectors = (this.selectors = []),
        selectorObjects = this.selectorObjects,
        removedIds = {},
        removeAll = arguments.length === 1;

      selectorIndexes = parseSelectorIndexes(this.indexes, selector);
      for (i = 0; i < selectorIndexes.length; i++) {
        selectorIndex = selectorIndexes[i];

        j = indexes.length;
        while (j--) {
          selIndex = indexes[j];
          if (selectorIndex.index.isPrototypeOf(selIndex)) {
            objs = selIndex.map.get(selectorIndex.key);
            if (objs) {
              k = objs.length;
              while (k--) {
                obj = objs[k];
                if (obj.selector === selector && (removeAll || obj.data === data)) {
                  objs.splice(k, 1);
                  removedIds[obj.id] = true;
                }
              }
            }
            break;
          }
        }
      }

      for (i in removedIds) {
        delete selectorObjects[i];
        this.size--;
      }

      for (i in selectorObjects) {
        selectors.push(selectorObjects[i].selector);
      }
    };

    // Sort by id property handler.
    //
    // a - Selector obj.
    // b - Selector obj.
    //
    // Returns Number.
    function sortById(a, b) {
      return a.id - b.id;
    }

    // Public: Find all matching decendants of the context element.
    //
    // context - An Element
    //
    // Returns Array of {selector, data, elements} matches.
    SelectorSet.prototype.queryAll = function(context) {
      if (!this.selectors.length) {
        return [];
      }

      var matches = {},
        results = [];
      var els = this.querySelectorAll(this.selectors.join(', '), context);

      var i, j, len, len2, el, m, match, obj;
      for (i = 0, len = els.length; i < len; i++) {
        el = els[i];
        m = this.matches(el);
        for (j = 0, len2 = m.length; j < len2; j++) {
          obj = m[j];
          if (!matches[obj.id]) {
            match = {
              id: obj.id,
              selector: obj.selector,
              data: obj.data,
              elements: []
            };
            matches[obj.id] = match;
            results.push(match);
          } else {
            match = matches[obj.id];
          }
          match.elements.push(el);
        }
      }

      return results.sort(sortById);
    };

    // Public: Match element against all selectors in set.
    //
    // el - An Element
    //
    // Returns Array of {selector, data} matches.
    SelectorSet.prototype.matches = function(el) {
      if (!el) {
        return [];
      }

      var i, j, k, len, len2, len3, index, keys, objs, obj, id;
      var indexes = this.activeIndexes,
        matchedIds = {},
        matches = [];

      for (i = 0, len = indexes.length; i < len; i++) {
        index = indexes[i];
        keys = index.element(el);
        if (keys) {
          for (j = 0, len2 = keys.length; j < len2; j++) {
            if ((objs = index.map.get(keys[j]))) {
              for (k = 0, len3 = objs.length; k < len3; k++) {
                obj = objs[k];
                id = obj.id;
                if (!matchedIds[id] && this.matchesSelector(el, obj.selector)) {
                  matchedIds[id] = true;
                  matches.push(obj);
                }
              }
            }
          }
        }
      }

      return matches.sort(sortById);
    };

    var bubbleEvents = {};
    var captureEvents = {};
    var propagationStopped = new WeakMap();
    var immediatePropagationStopped = new WeakMap();
    var currentTargets = new WeakMap();
    var currentTargetDesc = Object.getOwnPropertyDescriptor(Event.prototype, 'currentTarget');

    function before(subject, verb, fn) {
      var source = subject[verb];

      subject[verb] = function () {
        fn.apply(subject, arguments);
        return source.apply(subject, arguments);
      };

      return subject;
    }

    function matches(selectors, target, reverse) {
      var queue = [];
      var node = target;

      do {
        if (node.nodeType !== 1) break;

        var _matches = selectors.matches(node);

        if (_matches.length) {
          var matched = {
            node: node,
            observers: _matches
          };

          if (reverse) {
            queue.unshift(matched);
          } else {
            queue.push(matched);
          }
        }
      } while (node = node.parentElement);

      return queue;
    }

    function trackPropagation() {
      propagationStopped.set(this, true);
    }

    function trackImmediate() {
      propagationStopped.set(this, true);
      immediatePropagationStopped.set(this, true);
    }

    function getCurrentTarget() {
      return currentTargets.get(this) || null;
    }

    function defineCurrentTarget(event, getter) {
      if (!currentTargetDesc) return;
      Object.defineProperty(event, 'currentTarget', {
        configurable: true,
        enumerable: true,
        get: getter || currentTargetDesc.get
      });
    }

    function canDispatch(event) {
      try {
        event.eventPhase;
        return true;
      } catch (_) {
        return false;
      }
    }

    function dispatch(event) {
      if (!canDispatch(event)) return;
      var events = event.eventPhase === 1 ? captureEvents : bubbleEvents;
      var selectors = events[event.type];
      if (!selectors) return;
      var queue = matches(selectors, event.target, event.eventPhase === 1);
      if (!queue.length) return;
      before(event, 'stopPropagation', trackPropagation);
      before(event, 'stopImmediatePropagation', trackImmediate);
      defineCurrentTarget(event, getCurrentTarget);

      for (var i = 0, len1 = queue.length; i < len1; i++) {
        if (propagationStopped.get(event)) break;
        var matched = queue[i];
        currentTargets.set(event, matched.node);

        for (var j = 0, len2 = matched.observers.length; j < len2; j++) {
          if (immediatePropagationStopped.get(event)) break;
          matched.observers[j].data.call(matched.node, event);
        }
      }

      currentTargets["delete"](event);
      defineCurrentTarget(event);
    }

    function on(name, selector, fn) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var capture = options.capture ? true : false;
      var events = capture ? captureEvents : bubbleEvents;
      var selectors = events[name];

      if (!selectors) {
        selectors = new SelectorSet();
        events[name] = selectors;
        document.addEventListener(name, dispatch, capture);
      }

      selectors.add(selector, fn);
    }
    function off(name, selector, fn) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var capture = options.capture ? true : false;
      var events = capture ? captureEvents : bubbleEvents;
      var selectors = events[name];
      if (!selectors) return;
      selectors.remove(selector, fn);
      if (selectors.size) return;
      delete events[name];
      document.removeEventListener(name, dispatch, capture);
    }

    const EVENT_METADATA = '__event__metadata__';
    const ARIA_EXPANDED = "aria-expanded";
    const ARIA_CONTROLS = "aria-controls";
    const ARIA_SELECTED = "aria-selected";
    const HIDDEN = "hidden";
    class Config {
        constructor(event, selector, f) {
            this.event = event;
            this.selector = selector;
            this.f = f;
        }
    }
    class Behavior {
        constructor() {
        }
        enable(_root) {
            let root = _root ? _root : window.document;
            this.init(root);
            this.constructor[EVENT_METADATA].forEach((config) => {
                // console.log('config', config);
                // multiple events can be specified, separated by spaces
                config.event.split(" ").forEach((event) => {
                    on(event, config.selector, (args) => { config.f.call(this, args); });
                });
            });
        }
        disable() {
            this.constructor[EVENT_METADATA].forEach((config) => {
                // multiple events can be specified, separated by spaces
                config.event.split(" ").forEach((event) => {
                    off(event, config.selector, config.f);
                });
            });
        }
        /**
         * This method works for the following attributes:
         *
         * ARIA_EXPANDED
         * ARIA_SELECTED
         *
         * @param target
         * @param expanded
         * @param attribute
         */
        toggleControl(target, expanded, attribute) {
            let safeAttribute = attribute || ARIA_EXPANDED;
            let safeExpanded = expanded;
            if (typeof safeExpanded !== "boolean") {
                // invert the existing button value
                safeExpanded = target.getAttribute(safeAttribute) === "false";
            }
            target.setAttribute(safeAttribute, safeExpanded.toString());
            const controlledElementId = target.getAttribute(ARIA_CONTROLS);
            if (controlledElementId) {
                const controlledElement = document.getElementById(controlledElementId);
                if (!controlledElement) {
                    throw new Error(`aria-controls is not properly configured: ${controlledElementId}`);
                }
                if (safeExpanded) {
                    controlledElement.removeAttribute(HIDDEN);
                }
                else {
                    controlledElement.setAttribute(HIDDEN, "");
                }
            }
            return safeExpanded;
        }
        isElement(value) {
            return value && typeof value === "object" && value.nodeType === 1;
        }
        select(selector, context) {
            if (typeof selector !== "string") {
                return [];
            }
            if (!context || !this.isElement(context)) {
                context = window.document; // eslint-disable-line no-param-reassign
            }
            const selection = context.querySelectorAll(selector);
            return Array.prototype.slice.call(selection);
        }
        selectClosestTo(targetSelector, closestToSelector, context) {
            const elements = this.select(targetSelector, context);
            return elements.filter((element) => element.closest(closestToSelector) === context);
        }
    }

    const prefix = "jazz";

    const Listener = (config) => (target, _propertyKey, descriptor) => {
        const event = config.event;
        const selector = config.selector;
        const constructor = target.constructor;
        // Use of Object.defineProperty is important since it creates non-enumerable property which
        // prevents the property is copied during subclassing.
        const meta = constructor.hasOwnProperty(EVENT_METADATA) ?
            constructor[EVENT_METADATA] :
            Object.defineProperty(constructor, EVENT_METADATA, { value: [] })[EVENT_METADATA];
        const descriptorValue = descriptor ? descriptor.value : "";
        meta.push(new Config(event, selector, descriptorValue));
    };

    const ACCORDION_SELECTOR = `.${prefix}-accordion`;
    const ACCORDION_BUTTON_SELECTOR = `.${prefix}-accordion__button`;
    const ACCORDION_MULTISELECTABLE_CLASSNAME = `${prefix}-accordion-multiselectable`;
    const ACCORDION_CONTENT_EXPANDED_CLASSNAME = `${prefix}-accordion__content--expanded`;
    class AccordionBehavior extends Behavior {
        constructor() {
            super();
            this.getButtonMatchingContent = (button, accordion) => {
                const matchVal = button.getAttribute("aria-controls");
                return accordion.querySelector(`#${matchVal}`);
            };
            this.getAccordionButtons = (accordion) => {
                return this.selectClosestTo(ACCORDION_BUTTON_SELECTOR, ACCORDION_SELECTOR, accordion);
            };
            this.closeExpandedContents = (accordion, clickedButton) => {
                return this.getAccordionButtons(accordion).forEach((button) => {
                    var _a;
                    if (button !== clickedButton) {
                        this.toggleControl(button, false);
                        (_a = this.getButtonMatchingContent(button, accordion)) === null || _a === void 0 ? void 0 : _a.classList.remove(ACCORDION_CONTENT_EXPANDED_CLASSNAME);
                    }
                });
            };
        }
        init(root) {
            this.select(ACCORDION_BUTTON_SELECTOR, root).forEach((button) => {
                const expanded = button.getAttribute(ARIA_EXPANDED) === "true";
                this.toggleControl(button, expanded);
            });
        }
        // Behavior method override to remove logic for attribute check
        toggleControl(target, expanded) {
            let safeAttribute = ARIA_EXPANDED;
            let safeExpanded = expanded;
            if (typeof safeExpanded !== "boolean") {
                // invert the existing button value
                safeExpanded = target.getAttribute(safeAttribute) === "false";
            }
            target.setAttribute(safeAttribute, safeExpanded.toString());
            const controlledElementId = target.getAttribute(ARIA_CONTROLS);
            if (controlledElementId) {
                const controlledElement = document.getElementById(controlledElementId);
                if (!controlledElement) {
                    throw new Error(`aria-controls is not properly configured: ${controlledElementId}`);
                }
            }
            return safeExpanded;
        }
        onClick(event) {
            const button = event.target;
            const accordionEl = button.closest(ACCORDION_SELECTOR);
            if (accordionEl) {
                const multiselectable = accordionEl.classList.contains(ACCORDION_MULTISELECTABLE_CLASSNAME);
                const expanded = this.toggleControl(button, undefined);
                const content = this.getButtonMatchingContent(button, accordionEl);
                if (expanded) {
                    if (!multiselectable) {
                        this.closeExpandedContents(accordionEl, button);
                    }
                    content === null || content === void 0 ? void 0 : content.classList.add(ACCORDION_CONTENT_EXPANDED_CLASSNAME);
                }
                else {
                    content === null || content === void 0 ? void 0 : content.classList.remove(ACCORDION_CONTENT_EXPANDED_CLASSNAME);
                }
            }
            event.stopImmediatePropagation();
        }
    }
    __decorate([
        Listener({
            event: 'click',
            selector: ACCORDION_BUTTON_SELECTOR
        })
    ], AccordionBehavior.prototype, "onClick", null);

    const MODAL_SELECTOR = `.${prefix}-modal`;
    const MODAL_WRAPPER_SELECTOR = `.${prefix}-modal-wrapper`;
    const MODAL_BUTTON_SELECTOR = `.${prefix}-modal__button`;
    const INPUT_SELECTORS_EXCL_CLOSE = 'a[href]:not([disabled]), button:not([disabled]):not(.jazz-modal-button__close), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])';
    const INPUT_SELECTORS = 'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])';
    class ModalDialogBehavior extends Behavior {
        constructor() {
            super();
        }
        init(root) {
            this.select(MODAL_WRAPPER_SELECTOR, root).forEach((wrapper) => {
                wrapper.classList.remove('jazz-modal__wrapper--visible');
            });
        }
        onAction(event) {
            const button = event.target;
            const modalEl = button.closest(MODAL_SELECTOR);
            if (modalEl) {
                this.select(MODAL_WRAPPER_SELECTOR, modalEl).forEach((wrapper) => {
                    if (!this.handleKeyEvents(event, wrapper)) {
                        return;
                    }
                    if (button.matches(MODAL_BUTTON_SELECTOR) || event instanceof KeyboardEvent) {
                        wrapper.classList.toggle('jazz-modal__wrapper--visible');
                        if (wrapper.classList.contains('jazz-modal__wrapper--visible')) {
                            this.focusOnFirstInput(wrapper);
                        }
                    }
                });
            }
            event.stopImmediatePropagation();
        }
        handleKeyEvents(event, element) {
            if (event instanceof KeyboardEvent) {
                const keyEvent = event;
                const isTabPressed = (keyEvent.key === 'Tab');
                const isEscPressed = (keyEvent.key === 'Escape');
                const isEnterPressed = (keyEvent.key === 'Enter');
                // Handle tab navigation to keep it within the window
                if (isTabPressed) {
                    this.keepFocusWithin(keyEvent, element);
                    return false;
                }
                // Only allow Enter and Escape Key Press
                if (!isEnterPressed && !isEscPressed) {
                    return false;
                }
            }
            return true;
        }
        focusOnFirstInput(element) {
            const focusableEls = this.select(INPUT_SELECTORS_EXCL_CLOSE, element);
            if (focusableEls.length > 0) {
                focusableEls[0].focus();
            }
        }
        keepFocusWithin(keyEvent, modalEl) {
            const focusableEls = this.select(INPUT_SELECTORS, modalEl);
            const firstFocusableEl = focusableEls[0];
            const lastFocusableEl = focusableEls[focusableEls.length - 1];
            if (keyEvent.shiftKey) /* shift + tab */ {
                if (document.activeElement === firstFocusableEl) {
                    lastFocusableEl.focus();
                    keyEvent.preventDefault();
                }
            }
            else /* tab */ {
                if (document.activeElement === lastFocusableEl) {
                    firstFocusableEl.focus();
                    keyEvent.preventDefault();
                }
            }
        }
    }
    __decorate([
        Listener({
            event: 'keydown',
            selector: MODAL_SELECTOR
        }),
        Listener({
            event: 'click',
            selector: MODAL_BUTTON_SELECTOR
        })
    ], ModalDialogBehavior.prototype, "onAction", null);

    // import {HeaderBehavior} from "../header/header";
    // Main Menu Selectors
    const MENU_SELECTOR = `.${prefix}-menubar`;
    const MENU_BUTTON_SELECTOR = `.${prefix}-menu__menu-toggle`;
    const HEADER_NAV_SELECTOR = `.${prefix}-menu__nav-container`;
    const MENU_MAIN_MENU_SELECTOR = `.${prefix}-menu__main-menu-navbar`;
    // Submenu Selectors
    const HEADER_SUB_MENU_SELECTOR = `.${prefix}-menu__submenu-toggle`;
    // Used to conditionally hide and show menu to handle hovers + click open
    const MENU_STICKY_STYLE = `${prefix}-menubar--stuck`;
    const MENU_HIDE_STYLE = `${prefix}-menubar--hide`;
    // Styles to show menu in low resolution view
    const MENU_NAV_EXPANDED_STYLE = `${prefix}-menu__nav-container--expanded`;
    const MENU_SUB_NAV_EXPANDED_STYLE = `${prefix}-menu__subnav-container--expanded`;
    // Styles to show menu in high resolution view
    const MENUBAR_SHOWN_STYLE = `${prefix}-menubar--shown`;
    const MENUBAR_SUB_SHOWN_STYLE = `${prefix}-menubar_submenu--shown`;
    // Id used to identify recently closed sub nav
    const MENU_RECENTLY_OPENED_ID = `${prefix}-menu:recentlyOpened`;
    // Icons
    const ICON_SELECTOR$1 = `.${prefix}-icon`;
    const ICON_CLOSE$1 = `${prefix}-icon-close`;
    const ICON_MENU = `${prefix}-icon-menu`;
    class MenuToggleBehavior extends Behavior {
        constructor() {
            super();
        }
        init(root) {
            this.currentRoot = root;
            this.resetMenu(root);
            window.addEventListener("resize", this.displayWindowSize);
        }
        resetMenu(root) {
            this.select(MENU_BUTTON_SELECTOR, root).forEach((header) => {
                this.showMenu(false, header);
            });
            this.select(HEADER_SUB_MENU_SELECTOR, root).forEach((submenu) => {
                submenu.addEventListener('mouseleave', () => {
                    const navContainer = document.getElementById(MENU_RECENTLY_OPENED_ID);
                    if (navContainer) {
                        navContainer.classList.remove(MENU_HIDE_STYLE);
                        navContainer.id = "";
                    }
                });
            });
        }
        onAction(event) {
            // console.log('event', event);
            const button = event.target;
            // This will handle when the click event happens for the icons within the button element
            const targetButton = button.closest('button');
            // Depending on which button was clicked an action is performed
            if (targetButton && targetButton.matches(MENU_BUTTON_SELECTOR)) {
                this.toggleMenu(targetButton);
                // TODO: circular reference was removed, the menu toggle should emit an event instead of calling directly
                // const header: HeaderBehavior = new HeaderBehavior();
                // header.resetSearch(this.currentRoot);
                event.stopImmediatePropagation();
            }
            else if (targetButton && targetButton.matches(HEADER_SUB_MENU_SELECTOR)) {
                this.toggleSubMenu(targetButton);
                event.stopImmediatePropagation();
            }
        }
        toggleMenu(button) {
            const expandedAttr = button.getAttribute(ARIA_EXPANDED);
            const expand = !(expandedAttr && expandedAttr == "true");
            this.showMenu(expand, button);
        }
        showMenu(expand, button) {
            // This makes sure regardless of which button is picked that the menu elements are expanded/hidden
            const menuEl = button.closest(MENU_MAIN_MENU_SELECTOR);
            const buttonToReset = this.getButtonForSelector(MENU_BUTTON_SELECTOR, button, menuEl);
            const menuToggleIcon = buttonToReset.querySelector(ICON_SELECTOR$1);
            const navbar = menuEl.querySelector("ul");
            const navContainer = menuEl.querySelector(HEADER_NAV_SELECTOR);
            if (expand) {
                navContainer.classList.add(MENU_NAV_EXPANDED_STYLE);
                navbar.classList.add(MENUBAR_SHOWN_STYLE);
                buttonToReset.setAttribute(ARIA_EXPANDED, "true");
                menuToggleIcon.classList.remove("jazz-icon-menu");
                menuToggleIcon.classList.add(ICON_CLOSE$1);
            }
            else {
                navContainer.classList.remove(MENU_NAV_EXPANDED_STYLE);
                navbar.classList.remove(MENUBAR_SHOWN_STYLE);
                buttonToReset.setAttribute(ARIA_EXPANDED, "false");
                menuToggleIcon.classList.remove(ICON_CLOSE$1);
                menuToggleIcon.classList.add("jazz-icon-menu");
            }
        }
        toggleSubMenu(button) {
            const expandedAttr = button.getAttribute(ARIA_EXPANDED);
            const expand = !(expandedAttr && expandedAttr == "true");
            this.showSubMenu(expand, button);
        }
        showSubMenu(expand, button) {
            const mq = window.matchMedia("(min-width: 900px)");
            if (mq.matches) {
                this.showSubMenuFull(expand, button);
            }
            else {
                this.showSubMenuCondensed(expand, button);
            }
        }
        showSubMenuFull(expand, button) {
            // This makes sure regardless of which button is picked that the menu elements are expanded/hidden
            const navbar = button.closest("li");
            const buttonToReset = this.getButtonForSelector(HEADER_SUB_MENU_SELECTOR, button, navbar);
            const navContainer = navbar.querySelector("ul");
            if (expand) {
                this.closeSubMenus(button, true);
                navContainer.classList.add(MENU_STICKY_STYLE);
                navContainer.classList.remove(MENU_HIDE_STYLE);
                navbar.classList.add(MENU_STICKY_STYLE);
                buttonToReset.setAttribute(ARIA_EXPANDED, "true");
            }
            else {
                this.resetSubMenus(button);
                navContainer.classList.remove(MENU_STICKY_STYLE);
                navContainer.classList.add(MENU_HIDE_STYLE);
                navContainer.id = MENU_RECENTLY_OPENED_ID;
                navbar.classList.remove(MENU_STICKY_STYLE);
                buttonToReset.setAttribute(ARIA_EXPANDED, "false");
            }
        }
        closeSubMenus(button, disableNav) {
            const mainEl = button.closest(MENU_MAIN_MENU_SELECTOR);
            this.select("li", mainEl).forEach((navbar) => {
                this.select("ul", navbar).forEach((list) => {
                    list.classList.remove(MENU_STICKY_STYLE);
                    if (disableNav) {
                        list.classList.add(MENU_HIDE_STYLE);
                    }
                });
            });
            this.select(HEADER_SUB_MENU_SELECTOR, mainEl).forEach((button) => {
                button.setAttribute(ARIA_EXPANDED, "false");
            });
        }
        resetSubMenus(button) {
            const mainEl = button.closest(MENU_MAIN_MENU_SELECTOR);
            this.select("li", mainEl).forEach((navbar) => {
                this.select("ul", navbar).forEach((list) => {
                    list.classList.remove(MENU_STICKY_STYLE);
                    list.classList.remove(MENU_HIDE_STYLE);
                });
            });
        }
        showSubMenuCondensed(expand, button) {
            // This makes sure regardless of which button is picked that the menu elements are expanded/hidden
            const navbar = button.closest("li");
            const buttonToReset = this.getButtonForSelector(HEADER_SUB_MENU_SELECTOR, button, navbar);
            const navContainer = navbar.querySelector("ul");
            if (expand) {
                navContainer.classList.add(MENU_SUB_NAV_EXPANDED_STYLE);
                navbar.classList.add(MENUBAR_SUB_SHOWN_STYLE);
                buttonToReset.setAttribute(ARIA_EXPANDED, "true");
            }
            else {
                navContainer.classList.remove(MENU_SUB_NAV_EXPANDED_STYLE);
                navbar.classList.remove(MENUBAR_SUB_SHOWN_STYLE);
                buttonToReset.setAttribute(ARIA_EXPANDED, "false");
            }
        }
        // This retrieves the appropriate button depending on the selector passed in
        getButtonForSelector(btnSelector, button, mainEl) {
            if (!button.matches(btnSelector)) {
                button = mainEl.querySelector(btnSelector);
            }
            return button;
        }
        displayWindowSize() {
            // Main Menu Reset
            document.querySelectorAll(HEADER_NAV_SELECTOR).forEach((header) => {
                header.classList.remove(MENU_NAV_EXPANDED_STYLE);
                header.querySelectorAll("ul").forEach((navbar) => {
                    navbar.classList.remove(MENU_NAV_EXPANDED_STYLE);
                    navbar.classList.remove(MENUBAR_SHOWN_STYLE);
                    navbar.classList.remove(MENU_STICKY_STYLE);
                    navbar.querySelectorAll("li").forEach((submenu) => {
                        submenu.classList.remove(MENU_STICKY_STYLE);
                        submenu.classList.remove(MENU_HIDE_STYLE);
                    });
                });
            });
            document.querySelectorAll(MENU_BUTTON_SELECTOR).forEach((button) => {
                button.setAttribute(ARIA_EXPANDED, "false");
                const menuToggleIcon = button.querySelector(ICON_SELECTOR$1);
                menuToggleIcon === null || menuToggleIcon === void 0 ? void 0 : menuToggleIcon.classList.remove(ICON_CLOSE$1);
                menuToggleIcon === null || menuToggleIcon === void 0 ? void 0 : menuToggleIcon.classList.add(ICON_MENU);
            });
            // Sub Menus Reset
            document.querySelectorAll(MENU_SELECTOR).forEach((menu) => {
                menu.querySelectorAll("ul").forEach((navbar) => {
                    navbar.classList.remove(MENU_SUB_NAV_EXPANDED_STYLE);
                    navbar.classList.remove(MENUBAR_SUB_SHOWN_STYLE);
                });
            });
            document.querySelectorAll(HEADER_SUB_MENU_SELECTOR).forEach((button) => {
                button.setAttribute(ARIA_EXPANDED, "false");
            });
        }
    }
    __decorate([
        Listener({
            event: 'click',
            selector: MENU_BUTTON_SELECTOR
        }),
        Listener({
            event: 'click',
            selector: HEADER_SUB_MENU_SELECTOR
        })
    ], MenuToggleBehavior.prototype, "onAction", null);

    // Main Menu Selectors
    const HEADER_SELECTOR = `.${prefix}-header`;
    // Search Selectors
    const SEARCH_SELECTOR = `.${prefix}-header__search-bar-toggle`;
    const SEARCH_PANEL = `.${prefix}-header__search-bar-panel`;
    // Styles to show menu in high resolution view
    const SEARCH_SHOWN_STYLE = `${prefix}-header__search-bar-panel--shown`;
    // Icons
    const ICON_SELECTOR = `.${prefix}-icon`;
    const ICON_CLOSE = `${prefix}-icon-close`;
    const ICON_SEARCH = `${prefix}-icon-search`;
    class HeaderBehavior extends Behavior {
        constructor() {
            super();
        }
        init(root) {
            this.currentRoot = root;
            this.resetSearch(root);
            window.addEventListener("resize", this.displayWindowSize);
        }
        resetSearch(root) {
            this.select(SEARCH_SELECTOR, root).forEach((search) => {
                this.showSearch(false, search);
            });
        }
        onAction(event) {
            // console.log('event', event);
            const button = event.target;
            // This will handle when the click event happens for the icons within the button element
            const targetButton = button.closest('button');
            // Depending on which button was clicked an action is performed
            if (targetButton && targetButton.matches(SEARCH_SELECTOR)) {
                this.toggleSearch(targetButton);
                const menu = new MenuToggleBehavior();
                menu.resetMenu(this.currentRoot);
                event.stopImmediatePropagation();
            }
        }
        toggleSearch(button) {
            const expandedAttr = button.getAttribute(ARIA_EXPANDED);
            const expand = !(expandedAttr && expandedAttr == "true");
            this.showSearch(expand, button);
        }
        showSearch(expand, button) {
            // This makes sure regardless of which button is picked that the search elements are expanded/hidden
            const headerEl = button.closest(HEADER_SELECTOR);
            const buttonToReset = this.getButtonForSelector(SEARCH_SELECTOR, button, headerEl);
            const searchToggleIcon = buttonToReset.querySelector(ICON_SELECTOR);
            const searchbar = headerEl.querySelector(SEARCH_PANEL);
            if (expand) {
                searchbar.classList.add(SEARCH_SHOWN_STYLE);
                buttonToReset.setAttribute(ARIA_EXPANDED, "true");
                searchToggleIcon.classList.remove(ICON_SEARCH);
                searchToggleIcon.classList.add(ICON_CLOSE);
                const input = searchbar.querySelector("input[type='search']");
                input.focus();
            }
            else {
                searchbar.classList.remove(SEARCH_SHOWN_STYLE);
                buttonToReset.setAttribute(ARIA_EXPANDED, "false");
                searchToggleIcon.classList.remove(ICON_CLOSE);
                searchToggleIcon.classList.add(ICON_SEARCH);
            }
        }
        // This retrieves the appropriate button depending on the selector passed in
        getButtonForSelector(btnSelector, button, mainEl) {
            if (!button.matches(btnSelector)) {
                button = mainEl.querySelector(btnSelector);
            }
            return button;
        }
        displayWindowSize() {
            // Search Reset
            document.querySelectorAll(SEARCH_PANEL).forEach((searchbar) => {
                searchbar.classList.remove(SEARCH_SHOWN_STYLE);
            });
            document.querySelectorAll(SEARCH_SELECTOR).forEach((button) => {
                button.setAttribute(ARIA_EXPANDED, "false");
                const searchToggleIcon = button.querySelector(ICON_SELECTOR);
                searchToggleIcon === null || searchToggleIcon === void 0 ? void 0 : searchToggleIcon.classList.remove(ICON_CLOSE);
                searchToggleIcon === null || searchToggleIcon === void 0 ? void 0 : searchToggleIcon.classList.add(ICON_SEARCH);
            });
        }
    }
    __decorate([
        Listener({
            event: 'click',
            selector: SEARCH_SELECTOR
        })
    ], HeaderBehavior.prototype, "onAction", null);

    // Toggle Button Selector
    const NAV_TOGGLE_SELECTOR = `.${prefix}-utility-header__nav-toggle`;
    class UtilityHeaderBehavior extends Behavior {
        constructor() {
            super();
        }
        init(root) {
            this.currentRoot = root;
        }
        onAction(event) {
            const button = event.target;
            // This will handle when the click event happens for the icons within the button element
            const targetButton = button.closest('button');
            const expanded = (targetButton === null || targetButton === void 0 ? void 0 : targetButton.hasAttribute(ARIA_EXPANDED)) && targetButton.getAttribute(ARIA_EXPANDED) === 'true';
            const sectionEl = targetButton === null || targetButton === void 0 ? void 0 : targetButton.closest('.jazz-utility-header__nav');
            const iconEl = targetButton === null || targetButton === void 0 ? void 0 : targetButton.querySelector('.jazz-icon');
            const spanEl = targetButton === null || targetButton === void 0 ? void 0 : targetButton.querySelector('span');
            if (sectionEl) {
                if (expanded) {
                    targetButton === null || targetButton === void 0 ? void 0 : targetButton.setAttribute(ARIA_EXPANDED, 'false');
                    sectionEl.classList.remove('jazz-expanded');
                    iconEl === null || iconEl === void 0 ? void 0 : iconEl.classList.remove('jazz-icon-close');
                    iconEl === null || iconEl === void 0 ? void 0 : iconEl.classList.add('jazz-icon-menu');
                    if (spanEl) {
                        spanEl.innerText = 'Open Navigation Menu';
                    }
                }
                else {
                    targetButton === null || targetButton === void 0 ? void 0 : targetButton.setAttribute(ARIA_EXPANDED, 'true');
                    sectionEl.classList.add('jazz-expanded');
                    iconEl === null || iconEl === void 0 ? void 0 : iconEl.classList.remove('jazz-icon-menu');
                    iconEl === null || iconEl === void 0 ? void 0 : iconEl.classList.add('jazz-icon-close');
                    if (spanEl) {
                        spanEl.innerText = 'Close Navigation Menu';
                    }
                }
            }
            event.stopImmediatePropagation();
        }
        // This retrieves the appropriate button depending on the selector passed in
        getButtonForSelector(btnSelector, button, mainEl) {
            if (!button.matches(btnSelector)) {
                button = mainEl.querySelector(btnSelector);
            }
            return button;
        }
    }
    __decorate([
        Listener({
            event: 'click',
            selector: NAV_TOGGLE_SELECTOR
        })
    ], UtilityHeaderBehavior.prototype, "onAction", null);

    const PAGER_SELECTOR = `.${prefix}-pager`;
    class PagerBehavior extends Behavior {
        constructor() {
            super();
        }
        init(root) {
            this.select(PAGER_SELECTOR, root).forEach((pager) => {
                this.createPager(pager);
            });
        }
        createPager(pager) {
            const pagerEl = pager;
            if (pagerEl.dataset.totalPages && pagerEl.dataset.currentPage) {
                const listEl = document.createElement('ul');
                // add Previous Page
                this.addPage(listEl, pagerEl, "Previous", this.disablePrevious(pagerEl));
                const pages = this.iterablePages(pagerEl);
                pages.forEach((page) => {
                    if (page >= 0) {
                        const pageNum = page + 1;
                        this.addPage(listEl, pagerEl, pageNum.toString(), false);
                    }
                    else {
                        this.addPage(listEl, pagerEl, "...", true);
                    }
                });
                // add Last Page
                this.addPage(listEl, pagerEl, "Next", this.disableNext(pagerEl));
                pagerEl.appendChild(listEl);
            }
        }
        disablePrevious(pagerEl) {
            return Number(pagerEl.dataset.currentPage) === 1;
        }
        disableNext(pagerEl) {
            return Number(pagerEl.dataset.currentPage) === Number(pagerEl.dataset.totalPages);
        }
        addPage(listEl, pagerEl, displayPageStr, disable) {
            const li = document.createElement('li');
            if (!disable) {
                if (displayPageStr == Number(pagerEl.dataset.currentPage)) {
                    li.setAttribute("aria-current", "page");
                }
                li.appendChild(this.createLink(displayPageStr));
            }
            else {
                li.appendChild(this.createSpan(displayPageStr));
            }
            listEl.appendChild(li);
        }
        createLink(displayPageStr) {
            const link = document.createElement('a');
            link.appendChild(document.createTextNode(displayPageStr));
            link.setAttribute("href", "javascript:setPage(" + displayPageStr + ");");
            link.setAttribute("aria-label", this.setAriaLabel(displayPageStr));
            link.setAttribute("data-page", displayPageStr);
            return link;
        }
        createSpan(displayPageStr, isWithinLink = false) {
            const span = document.createElement('span');
            span.appendChild(document.createTextNode(displayPageStr));
            if (!isWithinLink) {
                span.setAttribute("aria-disabled", "true");
                span.setAttribute("data-page", displayPageStr);
            }
            return span;
        }
        setAriaLabel(displayPageStr) {
            if (displayPageStr === 'Previous' || displayPageStr === 'Next') {
                return displayPageStr;
            }
            else {
                return "Go to Page " + displayPageStr;
            }
        }
        iterablePages(pager) {
            const totalPages = Number(pager.dataset.totalPages);
            const currentPage = Number(pager.dataset.currentPage);
            let pages = [];
            let maxPages = 9;
            const delta = 4;
            let truncate = true;
            let pageNum = 0;
            if (totalPages < maxPages) {
                maxPages = totalPages;
                truncate = false;
                pageNum = 0;
            }
            else {
                if (currentPage - delta < 0) {
                    pageNum = 0;
                }
                else if ((currentPage + delta) > (totalPages - 1)) {
                    pageNum = totalPages - maxPages;
                }
                else {
                    pageNum = currentPage - delta;
                }
            }
            for (var pageIdx = 0; pageIdx < maxPages; pageIdx++) {
                if (truncate) {
                    if (pageIdx == 0) {
                        // always show the first page number
                        pages.push(0);
                    }
                    else if (pageIdx == 1 && pageNum != 1) {
                        // show '...' if second page is not a 2
                        pages.push(-1);
                    }
                    else if (pageIdx == maxPages - 1) {
                        // always show the last page number
                        pages.push(totalPages - 1);
                    }
                    else if (pageIdx == maxPages - 2 && pageNum != totalPages - 2) {
                        // show '...' if there is a gap between next to last page and last page
                        pages.push(-1);
                    }
                    else {
                        pages.push(pageNum);
                    }
                }
                else {
                    pages.push(pageNum);
                }
                pageNum++;
            }
            return pages;
        }
        onClick(event) {
            // Click is on the span tag
            const itemSpan = event.target;
            // Get the parent anchor tag
            const itemLink = itemSpan.closest("a");
            if (itemLink) {
                // Get the parent list item
                const item = itemLink.closest("li");
                // exit if there is no page value, this is when the page handles rendering the
                // pages instead of this component
                if (!itemLink.dataset.page) {
                    return;
                }
                // Get the page string
                const displayPageStr = itemLink.dataset.page;
                if (item && displayPageStr != '...') {
                    const pager = item.closest(PAGER_SELECTOR);
                    this.navigate(pager, displayPageStr, itemLink);
                }
            }
            event.stopImmediatePropagation();
        }
        navigate(pager, displayPageStr, itemLink) {
            let currentPage = Number(pager.dataset.currentPage);
            let totalPages = Number(pager.dataset.totalPages);
            switch (displayPageStr) {
                case 'Next':
                    currentPage = this.setNextPageValue(currentPage, totalPages);
                    break;
                case 'Previous':
                    currentPage = this.setPreviousPageValue(currentPage);
                    break;
                default:
                    currentPage = itemLink.dataset.page;
                    break;
            }
            pager.setAttribute("data-current-page", currentPage);
            this.refreshPager(pager);
        }
        setNextPageValue(currentPage, totalPages) {
            currentPage = currentPage + 1;
            if (currentPage > totalPages) {
                currentPage = totalPages;
            }
            return currentPage;
        }
        setPreviousPageValue(currentPage) {
            currentPage = currentPage - 1;
            if (currentPage < 1) {
                currentPage = 1;
            }
            return currentPage;
        }
        refreshPager(pager) {
            const uls = pager.querySelectorAll('ul');
            uls.forEach((ul) => {
                ul.parentNode.removeChild(ul);
            });
            this.createPager(pager);
        }
    }
    __decorate([
        Listener({
            event: 'click',
            selector: PAGER_SELECTOR
        })
    ], PagerBehavior.prototype, "onClick", null);

    const TABLIST_SELECTOR = `.${prefix}-tablist`;
    const TABLIST_BUTTON_ANCHOR_SELECTOR = `.${prefix}-tablist > button, .${prefix}-tablist > a`;
    class TabsBehavior extends Behavior {
        constructor() {
            super();
            /**
             * Find the tabs associated with the provided Tab list.
             *
             * @param tablist
             */
            this.getTabs = (tablist) => {
                return this.selectClosestTo(TABLIST_BUTTON_ANCHOR_SELECTOR, TABLIST_SELECTOR, tablist);
            };
        }
        /**
         * During initialization of tablist behavior, the following logic is performed:
         *
         * 1) Each tablist element is given the role of "tablist".
         * 2) Each tablist element is given the role of "tab".
         * 3) Content associated with each tab is shown/hidden based on the "aria-selected" attribute.
         *
         * @param root
         */
        init(root) {
            this.select(TABLIST_SELECTOR, root).forEach((tablist) => {
                tablist.setAttribute("role", "tablist");
            });
            // Selects buttons and anchor tags. For each element, set role="tab"
            this.select(TABLIST_BUTTON_ANCHOR_SELECTOR, root).forEach((element) => {
                element.setAttribute("role", "tab");
                const selected = element.getAttribute(ARIA_SELECTED) === "true";
                this.setTabSelection(element, selected);
            });
        }
        /**
         * Check if tab is a disabled anchor.
         *
         * @param tab
         */
        tabIsAnchorDisabled(tab) {
            return (tab instanceof HTMLAnchorElement) && tab.getAttribute("aria-disabled") === "true";
        }
        /**
         * Check if tabs are buttons.
         *
         * @param tabs // Can be either buttons or anchors.
         */
        tabsAreButtons(tabs) {
            return tabs && (tabs[0] instanceof HTMLButtonElement);
        }
        /**
         * Sets the tab as selected or not selected based on the provided boolean.
         *
         * @param tab // Can be either button or anchor.
         * @param selected
         */
        setTabSelection(tab, selected) {
            this.toggleControl(tab, selected, ARIA_SELECTED);
            // Enable the ability to get focus for the selected tab element and disable focus ability for all other tab elements
            tab.tabIndex = selected ? 0 : -1;
        }
        /**
         * Find the Tab list associated with the specified tab.
         *
         * @param tab
         */
        getTabListForTab(tab) {
            return tab.closest(TABLIST_SELECTOR);
        }
        /**
         * Find the first tab in the list of provided tabs
         *
         * @param tabs
         */
        getFirstTab(tabs) {
            if (this.tabsAreButtons(tabs)) {
                return (tabs && tabs.length > 0) ? tabs[0] : undefined;
            }
            return (tabs && tabs.length > 0) ? tabs[0] : undefined;
        }
        /**
         * Find the last tab in the list of provided tabs.
         *
         * @param tabs
         */
        getLastTab(tabs) {
            if (this.tabsAreButtons(tabs)) {
                return (tabs && tabs.length > 0) ? tabs.reverse()[0] : undefined;
            }
            return (tabs && tabs.length > 0) ? tabs.reverse()[0] : undefined;
        }
        /**
         * Find the next tab in the list of tabs provided.
         *
         * The search will begin at the position in the list where the provided tab is located and the search
         * will wrap around to the beginning of the provided list of tabs if no tab is found
         * in the list after the location of the provided tab.
         *
         * @param tabs
         * @param refTab
         */
        getNextTab(tabs, refTab) {
            let found = false;
            for (let tab of tabs) {
                if (found) {
                    return tab;
                }
                if (tab === refTab) {
                    found = true;
                }
            }
            return this.getFirstTab(tabs);
        }
        /**
         * Find the previous tab in the list of tabs provided.
         *
         * The search will begin at the position in the list where the provided tab is located and the search
         * will wrap around to the end of the provided list of tabs if no tab is found
         * in the list before the location of the provided tab.
         *
         * @param tabs
         * @param refTab
         */
        getPreviousTab(tabs, refTab) {
            let found = false;
            for (let tab of tabs.slice().reverse()) {
                if (found) {
                    return tab;
                }
                if (tab === refTab) {
                    found = true;
                }
            }
            return this.getLastTab(tabs);
        }
        /**
         * Determines if the tablist is configured to automatically select the tab when the tab receives focus.
         *
         * @param tablist
         */
        shouldSelectOnFocus(tablist) {
            return tablist && tablist.classList.contains("jazz-auto-activate");
        }
        /**
         * De-select the specified tab and hide any associated content.
         *
         * @param tab
         */
        deselectTab(tab) {
            this.setTabSelection(tab, false);
        }
        /**
         * Select the tab provided, show content associated with that tab, and de-select all other tabs.
         *
         * @param tab
         */
        selectTab(tab) {
            if (tab.getAttribute("aria-disabled") !== "true") {
                this.deselectAllOtherAnchorsInTablist(this.getTabListForTab(tab), tab);
                // The selected tab is always set to be selected (selected=true).  Selecting an active tab will not de-select it.
                this.setTabSelection(tab, true);
            }
        }
        /**
         * De-select all tabs in tablist, except the tab provided.
         *
         * @param tablist
         * @param exceptTab
         */
        deselectAllOtherAnchorsInTablist(tablist, exceptTab) {
            if (tablist) {
                this.getTabs(tablist).forEach((tab) => {
                    if (tab !== exceptTab) {
                        this.deselectTab(tab);
                    }
                });
            }
        }
        /**
         * Handle tab selection events.
         *
         * The tab associated with the selected (clicked) anchor will be selected.
         *
         * @param event
         */
        onClick(event) {
            const tab = event.target;
            this.selectTab(tab);
            event.stopImmediatePropagation();
        }
        /**
         * Handle tab keyboard events.
         *
         * @param event
         */
        onKeyup(event) {
            const eventTab = event.target;
            const keyEvent = event;
            const tablist = this.getTabListForTab(eventTab);
            let focusTab = undefined;
            // identify the tab that should receive focus based on the key that was pressed
            switch (keyEvent.key) {
                case 'ArrowRight':
                    focusTab = this.getNextTab(this.getTabs(tablist), eventTab);
                    break;
                case 'ArrowLeft':
                    focusTab = this.getPreviousTab(this.getTabs(tablist), eventTab);
                    break;
                case 'Home':
                    focusTab = this.getFirstTab(this.getTabs(tablist));
                    break;
                case 'End':
                    focusTab = this.getLastTab(this.getTabs(tablist));
                    break;
            }
            if (focusTab) {
                // set focus to the tab
                focusTab.focus();
                // if the tablist is configured to automatically select the tab upon focus, then select the tab
                if (this.shouldSelectOnFocus(tablist)) {
                    this.selectTab(focusTab);
                }
                event.stopImmediatePropagation();
            }
        }
    }
    __decorate([
        Listener({
            event: 'click',
            selector: TABLIST_BUTTON_ANCHOR_SELECTOR
        })
    ], TabsBehavior.prototype, "onClick", null);
    __decorate([
        Listener({
            event: 'keyup',
            selector: TABLIST_BUTTON_ANCHOR_SELECTOR
        })
    ], TabsBehavior.prototype, "onKeyup", null);

    const DROPDOWN_SELECTOR = `.${prefix}-dropdown-custom`;
    const SELECT_SELECTOR = `.${prefix}-dropdown-custom__select`;
    const SELECT_TRIGGER_SELECTOR = `${prefix}-dropdown-custom__select__trigger`;
    const ARROW_SELECTOR = `${prefix}-dropdown__arrow`;
    const OPTION_SELECTOR = `${prefix}-dropdown-custom__option`;
    const OPTION_LIST_SELECTOR = `${prefix}-dropdown-custom__options`;
    class DropdownBehavior extends Behavior {
        constructor() {
            super();
        }
        init(root) {
            this.createDivs(root);
            window.addEventListener('click', function (e) {
                document.querySelectorAll(SELECT_SELECTOR).forEach((select) => {
                    if (!select.contains(e.target)) {
                        select.classList.remove('open');
                    }
                });
            });
        }
        onClick(event) {
            const wrapper = event.target;
            const selectDiv = wrapper.closest(SELECT_SELECTOR);
            selectDiv === null || selectDiv === void 0 ? void 0 : selectDiv.classList.toggle('open');
            event.stopImmediatePropagation();
        }
        createTriggerDiv(selectElement) {
            let triggerDiv = document.createElement("DIV");
            triggerDiv.setAttribute("class", SELECT_TRIGGER_SELECTOR);
            // create the span that shows the selected option
            let sp = document.createElement("SPAN");
            sp.innerHTML = selectElement.options[selectElement.selectedIndex].innerHTML;
            triggerDiv.append(sp);
            //create the arrow div
            let arrow = document.createElement('DIV');
            arrow.setAttribute("class", ARROW_SELECTOR);
            triggerDiv.append(arrow);
            return triggerDiv;
        }
        createOptionDiv(selectElementItem) {
            let optionDiv = document.createElement("DIV");
            optionDiv.setAttribute("class", OPTION_SELECTOR);
            optionDiv.setAttribute("data-value", selectElementItem.value);
            optionDiv.innerHTML = selectElementItem.innerHTML;
            return optionDiv;
        }
        createDivs(root) {
            let selectElement, mainSelectDiv, optionListDiv, optionDiv;
            this.select(DROPDOWN_SELECTOR, root).forEach((wrapper) => {
                selectElement = wrapper.getElementsByTagName("select")[0];
                // let selectElementCount = selectElement.length;
                // Outer select div
                mainSelectDiv = document.createElement("DIV");
                mainSelectDiv.setAttribute("class", SELECT_SELECTOR.substr(1));
                // trigger div that shows the selected element and controls hiding/showing the options
                mainSelectDiv.append(this.createTriggerDiv(selectElement));
                /* For each element, create a new DIV that will contain the option list: */
                optionListDiv = document.createElement("DIV");
                optionListDiv.setAttribute("class", OPTION_LIST_SELECTOR);
                selectElement.forEach((selectElementItem) => {
                    /* For each option in the original select element,
                    create a new DIV that will act as an option item: */
                    optionDiv = this.createOptionDiv(selectElementItem);
                    optionDiv.addEventListener("click", function (element) {
                        var _a;
                        if (element != null) {
                            // Mark the selected option with the "selected class" and set the selected value in the triggerDiv
                            const selected = (_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.querySelector('.' + OPTION_SELECTOR + '.selected');
                            if (selected) {
                                selected.classList.remove('selected');
                            }
                            element.classList.add('selected');
                            // TODO; resolve this to handle nulls.
                            // @ts-ignore
                            element.closest(SELECT_SELECTOR).querySelector('.' + SELECT_TRIGGER_SELECTOR + ' span').textContent = element.textContent;
                            /* When an item is clicked, update the original select box,
                            and the selected item: */
                            // TODO: This needs to be fixed.  The chained parentNodes seems bad.
                            // @ts-ignore
                            let selectDivs = element.parentNode.parentNode.parentNode.getElementsByTagName("select")[0];
                            selectDivs.forEach((selectDiv, index) => {
                                if (selectDiv.innerHTML == element.innerHTML) {
                                    selectDivs.selectedIndex = index;
                                    // @ts-ignore
                                    // TODO: This needs to be fixed.  The chained parentNodes seems bad.
                                    let selectedOptions = element.parentNode.parentNode.getElementsByClassName("selected");
                                    selectedOptions.forEach((selectedOption) => {
                                        selectedOption.classList.remove("selected");
                                    });
                                    element.classList.add("selected");
                                }
                            });
                        }
                    });
                    optionListDiv.appendChild(optionDiv);
                });
                mainSelectDiv.appendChild(optionListDiv);
                wrapper.appendChild(mainSelectDiv);
                mainSelectDiv.addEventListener("click", function (e) {
                    /* When the select box is clicked, close any other select boxes,
                    and open/close the current select box: */
                    document.querySelectorAll(SELECT_SELECTOR).forEach((select) => {
                        if (!select.contains(e.target)) {
                            select.classList.remove('open');
                        }
                    });
                });
            });
        }
    }
    __decorate([
        Listener({
            event: 'click',
            selector: DROPDOWN_SELECTOR
        })
    ], DropdownBehavior.prototype, "onClick", null);

    class PrincetonDesignSystem {
        constructor() {
            this.scrolling = false;
            this.updateScrollCoords = () => {
                if (this.scrolling) {
                    this.scrolling = false;
                    this.scrollEvent();
                }
            };
        }
        // options allow consumers to disable behavior for components if they want to handle the behavior on their own
        enableDesignSystem() {
            this.disable();
            this.enable();
        }
        enable() {
            this.startTrackingScroll();
            new AccordionBehavior().enable();
            new ModalDialogBehavior().enable();
            new HeaderBehavior().enable();
            new MenuToggleBehavior().enable();
            new PagerBehavior().enable();
            new TabsBehavior().enable();
            new UtilityHeaderBehavior().enable();
            new DropdownBehavior().enable();
        }
        disable() {
            new AccordionBehavior().disable();
            new ModalDialogBehavior().disable();
            new HeaderBehavior().disable();
            new MenuToggleBehavior().disable();
            new PagerBehavior().disable();
            new TabsBehavior().disable();
            new UtilityHeaderBehavior().disable();
            new DropdownBehavior().disable();
            this.stopTrackingScroll();
        }
        startTrackingScroll() {
            window.addEventListener('scroll', () => {
                this.scrolling = true;
            });
            this.scrollInterval = setInterval(this.updateScrollCoords, 250);
        }
        scrollEvent() {
            var htmlEl = document.getElementsByTagName("html").item(0);
            if (htmlEl) {
                var scrollX = window.scrollX;
                var scrollY = window.scrollY;
                if (scrollX === 0) {
                    htmlEl.removeAttribute("data-jazz-scrollX");
                }
                else {
                    htmlEl.setAttribute("data-jazz-scrollX", window.scrollX.toString());
                }
                if (scrollY === 0) {
                    htmlEl.removeAttribute("data-jazz-scrollY");
                }
                else {
                    htmlEl.setAttribute("data-jazz-scrollY", window.scrollY.toString());
                }
            }
        }
        stopTrackingScroll() {
            clearInterval(this.scrollInterval);
            window.removeEventListener("scroll", this.scrollEvent);
            this.scrolling = false;
        }
    }

    exports.PrincetonDesignSystem = PrincetonDesignSystem;

    Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });

}));
//# sourceMappingURL=jazz-behavior.js.map
