'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
function getConfig(mod, cfg) {
	var ret = {
		'plain': !cfg.plain ? false : true,
		'width': null || cfg.width,
		'align': cfg.align || 'baseline',
		'lineHeight': cfg.lineHeight || '1.125em',
		'paddingLeft': cfg.paddingLeft === undefined ? cfg.padding === undefined ? 0 : cfg.padding : cfg.paddingLeft,
		'paddingRight': cfg.paddingRight === undefined ? cfg.padding === undefined ? 0 : cfg.padding : cfg.paddingRight
	};
	ret.padding = ret.paddingLeft + ret.paddingRight;
	for (var k in mod) {
		if (k === 'plain') ret.plain = true;else if (k === 'baseline' || k === 'top' || k === 'bottom' || k === 'middle' || k === 'none') ret.align = k;else if (/\d+/.test(k)) ret.width = parseInt(k);
	}
	return ret;
}

function newLine(el, span, config) {
	var tmp = span.cloneNode();
	el.insertBefore(tmp, span.nextSibling);
	span.style.display = null;
	tmp.removeAttribute('y');
	tmp.setAttribute('dy', config.lineHeight);
	tmp.setAttribute('x', config.paddingLeft);
	return tmp;
}

function set(el, text, config) {
	el[config.plain ? 'textContent' : 'innerHTML'] = text || '';
	if (!config.width) return;
	var plain = [];
	var physLn = el.getBBox().height;
	for (var i = 0; i < el.childNodes.length; i++) {
		var n = el.childNodes[i];
		if (n instanceof Text) {
			var tmp = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
			tmp.textContent = n.textContent;
			el.replaceChild(tmp, n);
			n = tmp;
		}
		plain.push(n.textContent.split(' '));
		n.textContent = '';
	}
	if (el.childElementCount) {
		el.childNodes[0].setAttribute('y', 0);
		el.childNodes[0].setAttribute('x', config.paddingLeft);
	}

	var offset = 0,
	    w = config.width - config.padding,
	    childCnt = el.childElementCount;
	for (var c = 0; c < childCnt; c++) {
		var words = plain[c];
		var wc = words.length,
		    span = el.childNodes[c + offset],
		    txt = '',
		    forceBreak = false;
		for (var _i = 0; _i < wc; _i++) {
			span.textContent += _i ? ' ' + words[_i] : words[_i];
			forceBreak = el.getBBox().width > w;
			while (forceBreak) {
				span.textContent = txt;
				span = newLine(el, span, config);
				txt = span.textContent = words[_i];
				offset++;
				if (el.getBBox().width > w) {
					span.style.display = 'none';
					txt = words[++_i];
					if (!txt) forceBreak = false;
				} else forceBreak = false;
			}
			txt = span.textContent;
		}
	}

	for (var _i2 = 0; _i2 < el.childNodes.length; _i2++) {
		el.childNodes[_i2].style.display = null;
	}if (config.align === 'middle') el.setAttribute('transform', 'translate(0, -' + (el.getBBox().height - physLn) / 2 + ')');else if (config.align === 'baseline') el.setAttribute('transform', 'translate(0, -' + (config.lineHeight - physLn) + ')');else if (config.align === 'bottom') el.setAttribute('transform', 'translate(0, -' + (el.getBBox().height - physLn) + ')');else if (config.align === 'top') el.setAttribute('transform', 'translate(0, ' + physLn + ')');
}

function directive(config) {
	if (!config) config = {};
	return {
		inserted: function inserted(el, binding) {
			if (!(el instanceof SVGTextElement)) throw new Error('Text-wrap directive must be bound to an SVG text element.');
			el.__WRAP_CONFIG = getConfig(binding.modifiers, config);
			set(el, binding.value, el.__WRAP_CONFIG);
		},
		update: function update(el, binding) {
			if (binding.value !== binding.oldValue) if (binding.value && typeof binding.value !== 'string') {
				var text = binding.value.text;
				set(el, text, Object.assign({}, el.__WRAP_CONFIG, binding.value));
			} else set(el, binding.value, el.__WRAP_CONFIG);
		},
		unbind: function unbind(el) {
			delete el.__WRAP_CONFIG;
		}
	};
}
var Wrapper = directive();
exports.default = Wrapper;
var ConfiguredWrapper = exports.ConfiguredWrapper = directive;

//# sourceMappingURL=index.pf.js.map