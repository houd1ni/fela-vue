import { when, complement, isNil, replace, both, isEmpty, compose, equals, type, map, ifElse, identity, prop, toPairs, length, last, qmergeDeep, test, split, fromPairs, qreverse, curry, join as join$1, forEach, filter, trim, always, qmap, qfilter, all, head, tail, slice, mergeShallow } from 'pepka';
import { createRenderer, combineRules } from 'fela';
import { renderToMarkup, rehydrate, render } from 'fela-dom';
import embedded from 'fela-plugin-embedded';
import prefixer from 'fela-plugin-prefixer';
import fallback from 'fela-plugin-fallback-value';
import unit from 'fela-plugin-unit';

const emptyObject = Object.freeze({});
const types = Object.freeze({ f: 'function', o: 'object', s: 'string' });
const camelify = (str) => str.replace(/-(\w)/gu, (_s, l) => l.toUpperCase());
const memoize = (fn) => {
    let cache;
    let cached = false;
    return () => cached ? cache : (cached = true, cache = fn());
};
const splitNonEscaped = (delims) => (str) => {
    const delims_lns = map(length, delims);
    const out = [];
    let i, j, last_index = 0, delims_count = delims.length, str_len = str.length;
    for (i = 0; i < str_len; i++) {
        for (j = 0; j < delims_count; j++) {
            if (str.slice(i, i + delims_lns[j]) === delims[j]
                && str[i - 1] !== '\\') {
                out.push(str.slice(last_index, i));
                i += delims_lns[j] - 1;
                last_index = i + 1;
            }
        }
    }
    if (last_index !== str.length - 1) {
        out.push(str.slice(last_index));
    }
    return out;
};
const escape = (() => {
    const patternRE = /url\(.*?\)/g;
    const signsRE = /[,:;]/g;
    return (v) => v.replace(patternRE, (v) => v.replace(signsRE, (s) => `\\${s}`));
})();
const unescape = when(complement(isNil), replace(/([^\\])\\([^\\])/g, '$1$2'));
const valuable = both(complement(isEmpty), complement(isNil));
const join = (strings, values) => strings.reduce((accum, str, i) => accum + str + (values.length > i ? values[i] : ''), '');
compose(equals('Object'), type);
const isWindow = compose(equals('Window'), type);
const tryNamedFn = (rule, name, useNamed) => {
    if (useNamed && name && name !== 'anonymous') {
        const tmpObj = {
            [name]: (props, renderer) => rule(props, renderer)
        };
        return tmpObj[name];
    }
    else
        return rule;
};
const isBrowser = (() => {
    try {
        return isWindow(window);
    }
    catch {
        return false;
    }
})();
const tryUnwrap = map(ifElse(compose(equals('Function'), type), identity, prop('default')));
const callWith = (args, i, fn) => fn(...(args[i] || []));
const preparePlugins = (plugins, args) => compose(map(([i, p]) => callWith(args, i, p)), toPairs, tryUnwrap)(plugins);
const re = {
    comment: /((\s+?\/\/.*$)|\/\*(.|[\n\r])*?\*\/)/gm,
    // senseless_lines: /[\n\r]{2,}|(?:;\s)/g,
    trailing_ws: /(^|\r|\n)+[\t ]+/g,
    repeatingSeps: /([;\n\r]){2,}/g,
    trailingSeps: /(?:(}|{|]|)^[;\n\r ]+)|(?:[;\n\r ]+($|}|{|]))/g,
    rule: /^([\w-]+)(: *| +)(.*)$/,
    rule_free: /[^\$](^|\r|\n|;|{)\s*([a-z-]+)[ :][\t ]*?:?[\t ]*?([^;\r\n]+)/g,
    selector: /^(([\|~\$@>\*\.:&\(\)\^="\-\[\]]+).*[ ,]*)+:?$/,
    spread: /^\.\.\.(\S*)$/,
    media: /^@media /,
    delim: /\s*,\s*/g,
    trailing_colon: /(.*):$/,
    class_mod: /[.&]/,
    eol: /[\n\r]/g,
    tliterals: /css\`((.|\s)*?)\`/g,
    interp: /\${(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*}/g
};

class Selector {
    s;
    rules = {};
    // @ts-disable-next it is being read in Selector.isSelector()
    __selector__ = true;
    get complex() {
        return this.s.className !== null && this.s.modifier !== null;
    }
    static isSelector(x) {
        return Boolean(x && x.__selector__);
    }
    serialize() {
        const { className, modifier } = this.s;
        return (className ? `.${className}` : '') + (modifier || '');
    }
    findClass(name, s = this) {
        if (s.s.className === name)
            return s;
        else
            for (const ruleName in s.rules) {
                const rule = s.rules[ruleName];
                if (Selector.isSelector(rule)) {
                    const res = rule.findClass(name);
                    if (res)
                        return res;
                }
            }
        return null;
    }
    constructor(selector) {
        const cls = selector.match(/^\.[\w-_]+/);
        this.s = {
            className: cls ? cls[0].slice(1) : null,
            modifier: cls ? selector.slice(cls[0].length) || null : selector
        };
    }
}

const extractRules = (s, depth = 0) => {
    const o = {};
    let tmp, full, key, newRules, k;
    for (k in s.rules) {
        tmp = s.rules[k];
        if (Selector.isSelector(tmp)) {
            tmp = tmp; // will get erased by minifier.
            full = tmp.complex ? tmp.s.className : tmp.serialize();
            key = (depth == 0 && full[0] == '.')
                ? full.slice(1)
                : full[0] == '.' ? `& ${full}` : full;
            newRules = tmp.complex
                ? { [tmp.s.modifier]: extractRules(tmp, depth + 1) }
                : extractRules(tmp, depth + 1);
            if (o[key])
                qmergeDeep(o[key], newRules);
            else
                o[key] = newRules;
        }
        else
            o[k] = tmp;
    }
    return o;
};
/** Keeps the structure of CSS to navigate and change the tree. */
class Levels {
    path = [];
    get out() {
        return extractRules(this.path[0][0]);
    }
    get depth() {
        return this.path.length;
    }
    add(selectors) {
        const curSelectors = last(this.path);
        const newCurs = [];
        for (const rawSel of selectors) {
            const sel = new Selector(rawSel);
            for (const curSel of curSelectors) {
                const fullSelector = sel.serialize();
                const old = curSel.rules[fullSelector];
                newCurs.push(old || sel);
                if (!old) {
                    curSel.rules[fullSelector] = sel;
                }
            }
        }
        this.path.push(newCurs);
    }
    merge(k, v) {
        if (valuable(v) && valuable(k)) {
            for (const o of last(this.path)) {
                o.rules[k] = v;
            }
        }
    }
    findClass(name) {
        for (const group of this.path)
            for (const s of group) {
                const res = s.findClass(name);
                if (res)
                    return res;
            }
        return null;
    }
    pop() {
        return this.path.pop();
    }
    constructor() {
        this.path.push([new Selector('__root')]);
    }
}

const r=Symbol("Placeholder"),t=t=>{let e=0;for(const n of t)n!==r&&e++;return e},e=(t,e)=>{const n=t.length,o=t.slice(),s=e.length;let c=s,u=0;for(;c&&u<n;u++)o[u]===r&&(o[u]=e[s-c],c--);for(u=n;c;u++,c--)o[u]=e[s-c];return o},n=(r,o,s)=>{const c=r.length-o.length-t(s);if(c<1)return r(...e(o,s));{const t=(...t)=>n(r,e(o,s),t);return t.$args_left=c,t}},o=r=>(...e)=>r.length>t(e)?n(r,[],e):r(...e),s=t=>function(e){return e===r?t:t(e)};function c(t){return function(e,n){const o=e===r,c=arguments.length;if(1===c&&o)throw new Error("Senseless placeholder usage.");return arguments.length>1?o?s((r=>t(r,n))):t(e,n):r=>t(e,r)}}function u(r){return o(r)}const l=void 0,f=1/0,i=r=>typeof r,a=r=>null===r,h={u:"U",b:"B",n:"N",s:"S",f:"F"},g=r=>{const t=i(r);return "object"===t?a(r)?"Null":r.constructor.name:h[t[0]]+t.slice(1)},b=c(((r,t)=>(t.push(r),t))),p=u(((r,t,e)=>e.reduce(r,t))),d=u(((r,t,e)=>{for(let n in e)switch(g(e[n])){case"Array":if(r>1&&"Array"===g(t[n]))switch(r){case 2:const o=t[n],s=e[n];for(const t in s)o[t]?d(r,o[t],s[t]):o[t]=s[t];break;case 3:t[n].push(...e[n]);}else t[n]=e[n];break;case"Object":if("Object"===g(t[n])){d(r,t[n],e[n]);break}default:t[n]=e[n];}return t}));d(1),d(2),d(3);const m=c(((r,t)=>{const e=g(r);if(e===g(t)&&("Object"===e||"Array"==e)){if(a(r)||a(t))return r===t;if(r===t)return !0;for(const e of [r,t])for(const n in e)if(!(e===t&&n in r||e===r&&n in t&&m(r[n],t[n])))return !1;return !0}return r===t})),y=o(((r,t,e,n)=>r(n)?t(n):e(n))),w=(...t)=>(...e)=>{let n,o=!0;for(let s=k(t)-1;s>-1;s--)o?(o=!1,n=t[s](...e)):n=n===r?t[s]():t[s](n);return n},j=c(((r,t)=>t[r])),A=c(((r,t)=>{if((r=>"string"===i(r))(t))return t.includes(r);for(const e of t)if(m(e,r))return !0;return !1})),N=u(((r,t,e)=>e.slice(r,(r=>"number"==i(r))(t)?t:f))),S=j(0);N(1,f);const O=r=>a(r)||(r=>r===l)(r),k=r=>r.length,B=r=>()=>r,E=c(((r,t)=>t.split(r))),q=r=>p(((r,t)=>A(t,r)?r:b(t,r)),[],r),v=u(((r,t,e)=>({...e,[r]:t}))),x=c(((r,t)=>t[r])),C=u(((r,t,e)=>y(k,(()=>O(e)?r:w(y(O,B(r),(e=>C(r,N(1,f,t),e))),(r=>c(((t,e)=>r(e,t))))(x)(e),S)(t)),B(e),t)));C(l);const F=/^(.*?)(8|16|32|64)(Clamped)?Array$/,I=(r,t=!1)=>{const e=g(r);switch(e){case"Null":case"String":case"Number":case"Boolean":case"Symbol":return r;case"Array":return t?[...r]:P(w(I,(r=>(...t)=>t[r])(0)),r);case"Object":if(t)return {...r};const n={};for(let t in r)n[t]=I(r[t]);return n;default:return F.test(e)?r.constructor.from(r):r}},M=u(((r,t,e)=>p(r,I(t),e))),P=c(((r,t)=>t.map(r))),{floor:U}=Math;let W,$,G="0123456789abcdefghijklmnopqrstuvwxyz";const H=w((r=>M(((r,t)=>v(...t,r)),{},r)),P(((r,t)=>[r,t])),E("")),J=r=>{if(!(r=>w(m(k(r)),k,q,E(""))(r))(r))throw new Error("Not all chars are unique!");W=r,$=W.length,H(W);};J(G+"ABCDEFGHIJKLMNOPQRSTUVWXYZ");const K=r=>{let t="";for(;r>0;)t=W[r%$]+t,r=U(r/$);return t||"0"};

const rules = `
top flex grid overflow transform transition-duration max-height 100%
margin margin-top margin-left margin-bottom margin-right justify-content
border width height left border-radius background bottom position align-items
center bottom absolute relative float right opacity z-index min-width
min-height border-top border-bottom border-left border-right filter
font-family font-size font-weight none hidden auto display block inline inline-block
padding padding-top padding-bottom padding-left padding-right text-align
flex-direction column box-shadow rotate content text-decoration max-width
fixed color space-between overflow-x overflow-y background-size
`.replace(/\s+/g, ',').split(/[, ]/g).filter(Boolean);
const prepareCompressRule = () => { let i = 0; return () => `a${K(i++)}`; };
const getDics = (pepka) => {
    const compressRule = prepareCompressRule();
    const { compose, fromPairs, map, qreverse, toPairs } = pepka;
    const dic = compose(fromPairs, map((rule) => [rule, compressRule()]))(rules);
    return { dic, dicRev: compose(fromPairs, qreverse, toPairs)(dic) };
};

let compression = false;
const setCompression = (to) => compression = to;
const dics$1 = getDics({ compose, fromPairs, map, qreverse, toPairs });
const analyseLine = (() => {
    const ruleRE = re.rule;
    const selectorRE = re.selector;
    const spreadRE = re.spread;
    const delimRE = re.delim;
    const mediaRE = re.media;
    const trailingColonRE = re.trailing_colon;
    const decompress = when(() => compression, (s) => dics$1.dicRev[s] || s);
    const getValue = (value) => {
        switch (value) {
            case 'undefined':
            case 'false':
            case '': return undefined;
            case 'null': return null;
            default: return isNaN(+value) ? value : +value;
        }
    };
    return (levels, line, names) => {
        let groups;
        switch (true) {
            case line == '{':
                levels.add(names);
                break;
            case line == '}':
                levels.pop();
                break;
            case (groups = spreadRE.exec(line)) !== null:
                const cls = levels.findClass(groups[1]);
                if (cls)
                    for (const name in cls.rules)
                        levels.merge(name, cls.rules[name]);
                break;
            case (groups = ruleRE.exec(line)) !== null:
                levels.merge(unescape(camelify(decompress(groups[1]))), when(isNaN, unescape, getValue(decompress(groups[3]))));
                break;
            case (groups = selectorRE.exec(line)) !== null:
                names.splice(0);
                names.push(...compose(map(replace(trailingColonRE, '$1')), ifElse(test(mediaRE), (l) => [l], split(delimRE)))(line));
                break;
        }
    };
})();

const errorString = 'fela-vue literal: unbalanced delimeter in functional expression !';
/** returns first and last indexes of entries themselves. */
const findEntries = curry(([start, end], str) => {
    let i, startI, str_len = str.length, delim_len = start.length, balance = 0, entries = [];
    for (i = 0; i < str_len; i++)
        switch (str.slice(i, i + delim_len)) {
            case start:
                i += delim_len - 1;
                if (balance == 0)
                    startI = i;
                balance++;
                break;
            case end:
                i += delim_len - 1;
                balance--;
                if (balance == 0)
                    entries.push([startI, i]);
                else if (balance < 0)
                    throw new Error(errorString);
        }
    return entries;
});
const injectExpressions = (line) => {
    const accum = [];
    let lastI = 0;
    for (let [from, to] of findEntries(['[', ']'], line)) {
        accum.push(line.slice(lastI, from), `\${${line
            .slice(from + 1, to)
            .replace(/(\W|^)\$([a-zA-Z_]+)\b/g, '$1$$ps.$2')
            .replace(/(\W|^)@(.+?)\b/g, '$1$t.$2')}}`);
        lastI = to + 1;
    }
    accum.push(line.slice(lastI));
    return accum.join('');
};
const intoExpression = compose(join$1('\n'), map(injectExpressions));
const createFunctions = (aug) => (lines) => {
    const out = [];
    let line, arrowI, selector, balance = 0, accum = [];
    for (line of lines) {
        if (balance > 0) {
            switch (line) {
                case '{':
                    balance++;
                    accum[accum.length - 1] += line;
                    break;
                case '}':
                    if (--balance == 1) {
                        if (aug) {
                            const gen = `($ps, $t) => css\`${intoExpression(accum)}\``;
                            out.push([selector, gen]); // only for internal aug stuff.
                        }
                        else {
                            const gen = new Function('$t,css,$ps', `return css\`
                ${intoExpression(accum)}
              \``);
                            out.push([selector, (props, t) => gen(t, css, props)]);
                        }
                        balance = 0;
                        accum.splice(0);
                    }
                    else {
                        accum[accum.length - 1] += line;
                    }
                    break;
                default:
                    accum.push(line);
            }
        }
        else {
            arrowI = line.indexOf('=>');
            if (~arrowI) {
                balance = 1;
                selector = line.slice(0, arrowI).trim().replace(/^\./, '');
            }
            else {
                out.push(line);
            }
        }
    }
    return out;
};

const parse = (() => {
    const delimiters = ['\n', '\r', ';'];
    const isDelimiter = (s) => delimiters.includes(s);
    const commentRE = re.comment;
    return (css, aug = false) => {
        const levels = new Levels();
        const names = []; // selector names, class names.
        return compose(() => levels.out, forEach((line) => {
            if (type(line) == 'Array')
                levels.merge(line[0], line[1]);
            else {
                if (line)
                    analyseLine(levels, line, names);
                if (levels.depth < 1)
                    throw new Error('lit-css parse error: unbalanced {} braces !');
            }
        }), createFunctions(aug), filter(complement(isEmpty)), map(trim), splitNonEscaped(delimiters), replace(/(\{|\})/g, (_, brace, offset, full) => {
            if (!isDelimiter(full[offset - 1]))
                brace = ';' + brace;
            if (!isDelimiter(full[offset + 1]))
                brace += ';';
            return brace;
        }), escape, replace(commentRE, ''))(css);
    };
})();

const classModRE = re.class_mod;
const notMark = '!';
const empty_str = '';
// TODO: modifiers reactivity ?..
const pickStyle = (style, name) => style[name] || style[camelify(name)];
const pickStyles = (getDefStyle, style, names, modifiers, context) => compose(qmap((name) => [
    name,
    pickStyle(style, name) || pickStyle(getDefStyle(), name) || emptyObject
]), qmap(last), qfilter((mods_and_name) => {
    if (length(mods_and_name) < 2)
        return true;
    const className = last(mods_and_name);
    let mod, invert, res;
    return all((mod_name) => {
        invert = head(mod_name) === notMark;
        if (invert)
            mod_name = tail(mod_name);
        mod = modifiers[mod_name];
        if (!mod)
            throw new Error(`[fela-vue] Class modifier with name ${mod_name} not found.`);
        res = mod(className, context);
        return invert ? !res : res;
    }, slice(0, -1, mods_and_name));
}), qmap(split(classModRE)), qfilter((s) => s !== empty_str), split(/[,\s\t]+/g))(names);
const getRules = (getDefStyle, style, propsOrRule, modifiers, context) => {
    if (!style)
        style = emptyObject;
    switch (typeof propsOrRule) {
        case types.f:
            return [
                propsOrRule.name,
                [(props) => propsOrRule(props, context)]
            ];
        case types.o:
            return [propsOrRule.className, [always(propsOrRule)]];
        case types.s:
            const styles = pickStyles(getDefStyle, style, propsOrRule, modifiers, context);
            const names = [];
            const rules = [];
            for (const [name, rule] of styles) {
                names.push(name);
                rules.push(...getRules(getDefStyle, style, rule, modifiers, context)[1]);
            }
            return [names.join('_'), rules];
        default:
            return ['', [identity]];
    }
};

// TODO: make it reactive by caching classes added by it.
const setClasses = function (sheet, root) {
    if (isBrowser)
        for (const tag in sheet) {
            const rules = sheet[tag];
            const simpleRules = [];
            for (const p in rules) {
                const rule = rules[p];
                if (type(rule) == 'Object') // p is a subselector.
                    this.setClasses(rule, document.querySelectorAll(tag + p));
                else // p is a rule
                    simpleRules.push([p, rule]);
            }
            if (simpleRules.length) {
                const renderClasses = this.renderClasses;
                const classes = renderClasses(null, fromPairs(simpleRules)).split(' ');
                (root || document.querySelectorAll(tag))
                    .forEach((el) => el.classList.add(...classes));
            }
        }
};

// TODO: make this inside of a ww.
const _css = (aug) => {
    return (strings, ...values) => {
        return parse(join(strings, values), aug);
    };
};
const css = _css(false);
const __specialcss = _css(true);

const mergeProps = (defaults, opts = {}) => compose(fromPairs, map(([k, v]) => {
    switch (type(v)) {
        case 'Array': return [k, [...v, ...(opts[k] || [])]];
        case 'Object': return [k, { ...v, ...(opts[k] || {}) }];
        default: return [k, opts[k] || v];
    }
}), toPairs)(defaults);
const defaultOpts = {
    method: 'f',
    defStyles: undefined,
    modifiers: {},
    plugins: [],
    enhancers: [],
    preset: { unit: [] },
    ssr: false
};
class Renderer {
    /** To use with fela-monolithic enhancer. */
    static devClassNames = false;
    renderer;
    _mixin;
    renderClasses;
    /** Vue Composition API endpoint. */
    styl;
    /** @returns Vue Options API mixin. */
    get mixin() {
        return Object.freeze(this._mixin);
    }
    /** @returns Entire css for SSR proposes. */
    get style() {
        return renderToMarkup(this.renderer);
    }
    /** Sets classes to DOM elements what match. Just like CSS. */
    setClasses = setClasses;
    constructor(opts = {}) {
        const { method, ssr, preset, plugins, enhancers, ...miscRenderOpts } = mergeProps(defaultOpts, opts);
        const presetConfig = { ...defaultOpts.preset, ...(preset || {}) };
        const thisRenderer = this;
        if (opts.fdef) {
            throw new Error('fela-vue: Change deprecated `fdef` to `defStyles`!');
        }
        // Fela renderer creation. 
        this.renderer = createRenderer({
            ...miscRenderOpts,
            enhancers,
            plugins: preparePlugins([
                unit,
                embedded,
                prefixer,
                fallback,
                ...plugins
            ], { 0: presetConfig.unit })
        });
        const { renderer } = this;
        // Default styles.
        const fdef = opts.defStyles;
        let fdefKey, fdefValue;
        switch (typeof fdef) {
            case types.o:
                [fdefKey, fdefValue] = [fdef.key, fdef.value];
                break;
            case types.f:
                [fdefKey, fdefValue] = ['fdef', fdef];
                break;
        }
        // Fela mounting.
        if (isBrowser)
            if (ssr)
                rehydrate(renderer);
            else
                render(renderer);
        this.renderClasses = (stylesheet, propsOrRule, props = emptyObject, modifiers) => {
            const [name, rules] = getRules(memoize(() => fdefValue ? fdefValue(this) : emptyObject), stylesheet, propsOrRule, modifiers ? mergeShallow(opts.modifiers, modifiers) : opts.modifiers, this);
            return renderer.renderRule(tryNamedFn(combineRules(...rules), name, Renderer.devClassNames), props) || undefined;
        };
        // Should be bound to Renderer.
        this.styl = (stylesheet, modifiers) => (propsOrRule, props, submodifiers) => this.renderClasses(stylesheet, propsOrRule, props, submodifiers ? mergeShallow(modifiers, submodifiers) : modifiers);
        // Mixin creation.
        this._mixin = filter(identity, {
            methods: {
                /** propsOrRule: any, props?: AnyObject */
                [method]: function (propsOrRule, props, submodifiers) {
                    return thisRenderer.renderClasses
                        .call(this, this.style, propsOrRule, props, submodifiers
                        ? mergeShallow(opts.modifiers, submodifiers)
                        : 'styleMods' in this && this.styleMods);
                }
            },
            computed: fdef && {
                [fdefKey]() {
                    return fdefValue(this);
                }
            }
        });
    }
}

class SvelteRenderer extends Renderer {
    static get devClassNames() {
        return Renderer.devClassNames;
    }
    /** To use with fela-monolithic enhancer. */
    static set devClassNames(x) {
        Renderer.devClassNames = x;
    }
    f;
    fdef;
    getCSS() {
        return (rules) => {
            const context = { style: rules, fdef: this.fdef };
            return (className, attrs) => this.f.call(context, className, attrs);
        };
    }
    getLiteralCSS() {
        const rulz = this.getCSS();
        return (...template) => rulz(css(...template));
    }
    constructor(opts = {}) {
        super(opts);
        const mixin = this.mixin;
        this.f = mixin.methods.f;
        this.fdef = typeof opts.defStyles == 'function'
            ? mixin.computed.fdef
            : opts.defStyles && mixin.computed[opts.defStyles.key];
    }
}

const prepareCompressRules = (dics, pepka) => {
    const { compose, replace, trim } = pepka;
    return compose(replace(re.trailingSeps, '$2'), replace(re.repeatingSeps, '$1'), 
    // replace(re.senseless_lines, '\n'),
    replace(re.trailing_ws, '$1'), replace(re.comment, ''), replace(re.rule_free, (s, trailing, k, v) => v
        ? trailing +
            (k && v
                ? `${trim(dics.dic[k] || k)}:${trim(dics.dic[v] || v)};`
                : trim(k ? s.replace(k, dics.dic[k] || k)
                    : v ? s.replace(k, dics.dic[v] || v)
                        : s))
        : ''));
};
let dics = null;
const rollupCSSCompression = function () {
    return {
        name: 'fela-vue-compression',
        async transform(code) {
            const pepka = await import('pepka');
            const { compose, take, replace } = pepka;
            if (!dics)
                dics = getDics(pepka);
            const compressRules = prepareCompressRules(dics, pepka);
            let res = '';
            try {
                res = code.replace(re.tliterals, compose((a) => `css\`${compressRules(a)}\``, replace(re.interp, replace(re.eol, ' ')), take(1)));
            }
            catch (e) {
                console.warn(e);
            }
            return { code: res || code, map: null };
        }
    };
};

export { Renderer, SvelteRenderer, __specialcss, css, rollupCSSCompression, setCompression };
