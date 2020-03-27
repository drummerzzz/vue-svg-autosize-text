"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfiguredWrapper = exports["default"] = void 0;
var SVG_NS = 'http://www.w3.org/2000/svg';
var alignments = {
  'top': true,
  'baseline': true,
  'bottom': true,
  'middle': true
};

function getConfig(mod, cfg) {
  var ret = {
    'plain': !cfg.plain ? false : true,
    'x': !cfg.x ? 0 : cfg.x,
    'width': null || cfg.width,
    'height': null || cfg.height,
    'align': cfg.align === 'none' || cfg.align === false ? false : alignments[cfg.align] ? cfg.align : 'baseline',
    'lineHeight': cfg.lineHeight || '1.125em',
    'paddingLeft': !cfg.paddingLeft ? !cfg.padding ? 0 : cfg.padding : cfg.paddingLeft,
    'paddingRight': !cfg.paddingRight ? !cfg.padding ? 0 : cfg.padding : cfg.paddingRight,
    'afterReflow': cfg.afterReflow instanceof Function ? cfg.afterReflow : false,
    'physicalMeasurement': cfg.physicalMeasurement ? true : false
  };
  ret._padding = ret.paddingLeft + ret.paddingRight;

  for (var k in mod) {
    if (k === 'plain') ret.plain = true;else if (alignments[k]) {
      ret.align = k;
    } else if (k === 'none') {
      ret.align = false;
    } else if (/\d+/.test(k)) ret.width = parseInt(k);
  }

  return ret;
}

var fontSize = 150

function newLine(el, span, config) {
  var tmp = span.cloneNode();
  el.insertBefore(tmp, span.nextSibling);
  span.style.display = '';
  tmp.removeAttribute('y');
  tmp.setAttribute('dy', config.lineHeight);
  //if (config.x)
  tmp.setAttribute('x', config.x);
  // tmp.setAttribute('rx',20)
  // tmp.setAttribute('ry', 20)
  return tmp;
}

function resizeWidth(el, text, config) {
  el[config.plain ? 'textContent' : 'innerHTML'] = text || '';
  var pscale = config.physicalMeasurement ? 1 : el.__OWNING_SVG.viewBox.animVal.width / el.__OWNING_SVG.getBoundingClientRect().width;
  var plain = [];

  for (var i = 0; i < el.childNodes.length; i++) {
    var n = el.childNodes[i];

    if (n instanceof Text) {
      var tmp = document.createElementNS(SVG_NS, 'tspan');
      tmp.textContent = n.textContent;
      el.replaceChild(tmp, n);
      n = tmp;
    }

    if (config.width) {
      plain.push(n.textContent.split(/\s/));
      n.textContent = '';
    }
  }

  // if (config.align) {
  //   el.childNodes[0].setAttribute('x', config.paddingLeft);
  // }

  if (config.width) {
    for (var _i = 0; _i < el.childNodes.length; _i++) {
      var _n = el.childNodes[_i];

      if (_n instanceof Text) {
        var _tmp = document.createElementNS(SVG_NS, 'tspan');

        _tmp.textContent = _n.textContent;
        el.replaceChild(_tmp, _n);
        _n = _tmp;
      }

      plain.push(_n.textContent.split(/\s/));
    }

    var offset = 0,
        w = config.width - config._padding,
        childCnt = el.childElementCount;

    for (var c = 0; c < childCnt; c++) {
      var words = plain[c];
      var wc = words.length,
          span = el.childNodes[c + offset],
          txt = '',
          forceBreak = false;

      for (var _i2 = 0; _i2 < wc; _i2++) {
        span.textContent += _i2 ? ' ' + words[_i2] : words[_i2];
        forceBreak = el.getBoundingClientRect().width * pscale > w;

        while (forceBreak) {
          span.textContent = txt;
          span = newLine(el, span, config);
          txt = span.textContent = words[_i2];
          offset++;

          if (el.getBoundingClientRect().width * pscale > w) {
            span.style.display = 'none';
            txt = words[++_i2];
            if (!txt) forceBreak = false;
          } else forceBreak = false;
        }

        txt = span.textContent;
      }
    }
  }
}

function set(el, text, config) {
  el[config.plain ? 'textContent' : 'innerHTML'] = text || '';
  var pscale = config.physicalMeasurement ? 1 : el.__OWNING_SVG.viewBox.animVal.height / el.__OWNING_SVG.getBoundingClientRect().height;
  el.setAttribute('font-size', 150);
  resizeWidth(el, text, config);

  if (config.height) {
    var forceResize = el.getBoundingClientRect().height * pscale > config.height;

    while (forceResize) {
      var size = el.getAttribute('font-size');
      var height = el.getBoundingClientRect().height * pscale;

      if (height > config.height) {
        el.setAttribute('font-size', size -1);
      } else {
        forceResize = false;
        resizeWidth(el, text, config);
      }
    }
  }

  if (!el.childNodes.length) return;

  for (var _i3 = 0; _i3 < el.childNodes.length; _i3++) {
    el.childNodes[_i3].style.display = '';
  }
  el.setAttribute('x', config.x);
  fontSize = el.getAttribute('font-size')
}

function directive(config) {
  if (!config) config = {};
  var r = {
    inserted: function inserted(el, binding) {
      if (!(el instanceof SVGTextElement)) throw new Error('Text-wrap directive must be bound to an SVG text element.');
      el.__WRAP_CONFIG = getConfig(binding.modifiers, config);
      el.__OWNING_SVG = el.parentNode;

      while (!(el.__OWNING_SVG instanceof SVGSVGElement)) {
        el.__OWNING_SVG = el.__OWNING_SVG.parentNode;
      }

      r.update.apply(this, arguments);
    },
    update: function update(el, binding, _ref) {
      var context = _ref.context;

      if (binding.value != binding.oldValue) {
        var cfg = el.__WRAP_CONFIG;

        if (binding.value && typeof binding.value !== 'string') {
          var text = binding.value.text;
          cfg = getConfig({}, Object.assign({}, el.__WRAP_CONFIG, binding.value));
          set(el, text, cfg);
        } else set(el, binding.value, cfg);

        if (cfg.afterReflow) cfg.afterReflow.call(context, el, cfg);
      }
    },
    unbind: function unbind(el) {
      delete el.__WRAP_CONFIG;
    }
  };
  return r;
}

var Wrapper = directive();
var _default = Wrapper;
exports["default"] = _default;
var ConfiguredWrapper = directive;
exports.ConfiguredWrapper = ConfiguredWrapper;
exports.wrapper = _default
exports.fontSize = fontSize
//# sourceMappingURL=index.js.map