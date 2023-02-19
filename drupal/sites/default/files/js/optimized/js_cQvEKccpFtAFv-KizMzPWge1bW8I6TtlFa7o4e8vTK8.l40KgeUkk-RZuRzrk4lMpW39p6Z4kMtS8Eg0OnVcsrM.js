/* Source and licensing information for the line(s) below can be found at http://localhost/drupal/core/assets/vendor/ckeditor5/block-quote/block-quote.js. */
!function(e){const t=e.en=e.en||{};t.dictionary=Object.assign(t.dictionary||{},{"Block quote":"Block quote"})}(window.CKEDITOR_TRANSLATIONS||(window.CKEDITOR_TRANSLATIONS={})),
/*!
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */(()=>{var e={446:(e,t,o)=>{"use strict";o.d(t,{Z:()=>i});var n=o(609),r=o.n(n)()((function(e){return e[1]}));r.push([e.id,".ck-content blockquote{border-left:5px solid #ccc;font-style:italic;margin-left:0;margin-right:0;overflow:hidden;padding-left:1.5em;padding-right:1.5em}.ck-content[dir=rtl] blockquote{border-left:0;border-right:5px solid #ccc}",""]);const i=r},609:e=>{"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var o=e(t);return t[2]?"@media ".concat(t[2]," {").concat(o,"}"):o})).join("")},t.i=function(e,o,n){"string"==typeof e&&(e=[[null,e,""]]);var r={};if(n)for(var i=0;i<this.length;i++){var c=this[i][0];null!=c&&(r[c]=!0)}for(var s=0;s<e.length;s++){var l=[].concat(e[s]);n&&r[l[0]]||(o&&(l[2]?l[2]="".concat(o," and ").concat(l[2]):l[2]=o),t.push(l))}},t}},62:(e,t,o)=>{"use strict";var n,r=function(){return void 0===n&&(n=Boolean(window&&document&&document.all&&!window.atob)),n},i=function(){var e={};return function(t){if(void 0===e[t]){var o=document.querySelector(t);if(window.HTMLIFrameElement&&o instanceof window.HTMLIFrameElement)try{o=o.contentDocument.head}catch(e){o=null}e[t]=o}return e[t]}}(),c=[];function s(e){for(var t=-1,o=0;o<c.length;o++)if(c[o].identifier===e){t=o;break}return t}function l(e,t){for(var o={},n=[],r=0;r<e.length;r++){var i=e[r],l=t.base?i[0]+t.base:i[0],a=o[l]||0,u="".concat(l," ").concat(a);o[l]=a+1;var d=s(u),f={css:i[1],media:i[2],sourceMap:i[3]};-1!==d?(c[d].references++,c[d].updater(f)):c.push({identifier:u,updater:v(f,t),references:1}),n.push(u)}return n}function a(e){var t=document.createElement("style"),n=e.attributes||{};if(void 0===n.nonce){var r=o.nc;r&&(n.nonce=r)}if(Object.keys(n).forEach((function(e){t.setAttribute(e,n[e])})),"function"==typeof e.insert)e.insert(t);else{var c=i(e.insert||"head");if(!c)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");c.appendChild(t)}return t}var u,d=(u=[],function(e,t){return u[e]=t,u.filter(Boolean).join("\n")});function f(e,t,o,n){var r=o?"":n.media?"@media ".concat(n.media," {").concat(n.css,"}"):n.css;if(e.styleSheet)e.styleSheet.cssText=d(t,r);else{var i=document.createTextNode(r),c=e.childNodes;c[t]&&e.removeChild(c[t]),c.length?e.insertBefore(i,c[t]):e.appendChild(i)}}function p(e,t,o){var n=o.css,r=o.media,i=o.sourceMap;if(r?e.setAttribute("media",r):e.removeAttribute("media"),i&&"undefined"!=typeof btoa&&(n+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}var m=null,h=0;function v(e,t){var o,n,r;if(t.singleton){var i=h++;o=m||(m=a(t)),n=f.bind(null,o,i,!1),r=f.bind(null,o,i,!0)}else o=a(t),n=p.bind(null,o,t),r=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(o)};return n(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;n(e=t)}else r()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=r());var o=l(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var n=0;n<o.length;n++){var r=s(o[n]);c[r].references--}for(var i=l(e,t),a=0;a<o.length;a++){var u=s(o[a]);0===c[u].references&&(c[u].updater(),c.splice(u,1))}o=i}}}},704:(e,t,o)=>{e.exports=o(79)("./src/core.js")},331:(e,t,o)=>{e.exports=o(79)("./src/enter.js")},181:(e,t,o)=>{e.exports=o(79)("./src/typing.js")},273:(e,t,o)=>{e.exports=o(79)("./src/ui.js")},209:(e,t,o)=>{e.exports=o(79)("./src/utils.js")},79:e=>{"use strict";e.exports=CKEditor5.dll}},t={};function o(n){var r=t[n];if(void 0!==r)return r.exports;var i=t[n]={id:n,exports:{}};return e[n](i,i.exports,o),i.exports}o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.nc=void 0;var n={};(()=>{"use strict";o.r(n),o.d(n,{BlockQuote:()=>g,BlockQuoteEditing:()=>u,BlockQuoteUI:()=>v});var e=o(704),t=o(331),r=o(181),i=o(209);class c extends e.Command{refresh(){this.value=this._getValue(),this.isEnabled=this._checkEnabled()}execute(e={}){const t=this.editor.model,o=t.schema,n=t.document.selection,r=Array.from(n.getSelectedBlocks()),i=void 0===e.forceValue?!this.value:e.forceValue;t.change((e=>{if(i){const t=r.filter((e=>s(e)||a(o,e)));this._applyQuote(e,t)}else this._removeQuote(e,r.filter(s))}))}_getValue(){const e=this.editor.model.document.selection,t=(0,i.first)(e.getSelectedBlocks());return!(!t||!s(t))}_checkEnabled(){if(this.value)return!0;const e=this.editor.model.document.selection,t=this.editor.model.schema,o=(0,i.first)(e.getSelectedBlocks());return!!o&&a(t,o)}_removeQuote(e,t){l(e,t).reverse().forEach((t=>{if(t.start.isAtStart&&t.end.isAtEnd)return void e.unwrap(t.start.parent);if(t.start.isAtStart){const o=e.createPositionBefore(t.start.parent);return void e.move(t,o)}t.end.isAtEnd||e.split(t.end);const o=e.createPositionAfter(t.end.parent);e.move(t,o)}))}_applyQuote(e,t){const o=[];l(e,t).reverse().forEach((t=>{let n=s(t.start);n||(n=e.createElement("blockQuote"),e.wrap(t,n)),o.push(n)})),o.reverse().reduce(((t,o)=>t.nextSibling==o?(e.merge(e.createPositionAfter(t)),t):o))}}function s(e){return"blockQuote"==e.parent.name?e.parent:null}function l(e,t){let o,n=0;const r=[];for(;n<t.length;){const i=t[n],c=t[n+1];o||(o=e.createPositionBefore(i)),c&&i.nextSibling==c||(r.push(e.createRange(o,e.createPositionAfter(i))),o=null),n++}return r}function a(e,t){const o=e.checkChild(t.parent,"blockQuote"),n=e.checkChild(["$root","blockQuote"],t);return o&&n}class u extends e.Plugin{static get pluginName(){return"BlockQuoteEditing"}static get requires(){return[t.Enter,r.Delete]}init(){const e=this.editor,t=e.model.schema;e.commands.add("blockQuote",new c(e)),t.register("blockQuote",{inheritAllFrom:"$container"}),e.conversion.elementToElement({model:"blockQuote",view:"blockquote"}),e.model.document.registerPostFixer((o=>{const n=e.model.document.differ.getChanges();for(const e of n)if("insert"==e.type){const n=e.position.nodeAfter;if(!n)continue;if(n.is("element","blockQuote")&&n.isEmpty)return o.remove(n),!0;if(n.is("element","blockQuote")&&!t.checkChild(e.position,n))return o.unwrap(n),!0;if(n.is("element")){const e=o.createRangeIn(n);for(const n of e.getItems())if(n.is("element","blockQuote")&&!t.checkChild(o.createPositionBefore(n),n))return o.unwrap(n),!0}}else if("remove"==e.type){const t=e.position.parent;if(t.is("element","blockQuote")&&t.isEmpty)return o.remove(t),!0}return!1}));const o=this.editor.editing.view.document,n=e.model.document.selection,r=e.commands.get("blockQuote");this.listenTo(o,"enter",((t,o)=>{if(!n.isCollapsed||!r.value)return;n.getLastPosition().parent.isEmpty&&(e.execute("blockQuote"),e.editing.view.scrollToTheSelection(),o.preventDefault(),t.stop())}),{context:"blockquote"}),this.listenTo(o,"delete",((t,o)=>{if("backward"!=o.direction||!n.isCollapsed||!r.value)return;const i=n.getLastPosition().parent;i.isEmpty&&!i.previousSibling&&(e.execute("blockQuote"),e.editing.view.scrollToTheSelection(),o.preventDefault(),t.stop())}),{context:"blockquote"})}}var d=o(273),f=o(62),p=o.n(f),m=o(446),h={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};p()(m.Z,h);m.Z.locals;class v extends e.Plugin{static get pluginName(){return"BlockQuoteUI"}init(){const t=this.editor,o=t.t;t.ui.componentFactory.add("blockQuote",(n=>{const r=t.commands.get("blockQuote"),i=new d.ButtonView(n);return i.set({label:o("Block quote"),icon:e.icons.quote,tooltip:!0,isToggleable:!0}),i.bind("isOn","isEnabled").to(r,"value","isEnabled"),this.listenTo(i,"execute",(()=>{t.execute("blockQuote"),t.editing.view.focus()})),i}))}}class g extends e.Plugin{static get requires(){return[u,v]}static get pluginName(){return"BlockQuote"}}})(),(window.CKEditor5=window.CKEditor5||{}).blockQuote=n})();
/* Source and licensing information for the above line(s) can be found at http://localhost/drupal/core/assets/vendor/ckeditor5/block-quote/block-quote.js. */