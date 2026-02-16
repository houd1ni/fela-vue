import { when, complement, isNil, replace, both, isEmpty, typeIs, map, ifElse, identity, prop, compose, toPairs, length, last, qmergeDeep, qmap, test, split, fromPairs, qreverse, curry, join as join$1, forEach, type, qfilter, trim, qassoc, all, head, tail, slice, always, eq, mergeShallow, once } from 'pepka';
import { createRenderer, combineRules } from 'fela';
import { renderToMarkup, rehydrate, render } from 'fela-dom';
import embedded from 'fela-plugin-embedded';
import fallback from 'fela-plugin-fallback-value';
import unit from 'fela-plugin-unit';

const emptyObject = Object.freeze({});
const types = Object.freeze({ f: 'function', o: 'object', s: 'string' });
const camelify = (str) => str.replace(/-(\w)/gu, (_s, l) => l.toUpperCase());
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
typeIs('Object');
const isFunction = typeIs('Function');
const isWindow = typeIs('Window');
const isBrowser = (() => {
    try {
        return isWindow(window);
    }
    catch {
        return false;
    }
})();
const tryUnwrap = map(ifElse(isFunction, identity, prop('default')));
const callWith = (args, i, fn) => fn(...(args[i] || []));
const preparePlugins = (plugins, args) => compose(map(([i, p]) => callWith(args, i, p)), toPairs, tryUnwrap)(plugins);
const re = {
    comment: /((\s+?\/\/.*$)|\/\*(.|[\n\r])*?\*\/)/gm,
    trailing_ws: /(^|\r|\n)+[\t ]+/g,
    repeatingSeps: /([;\s]+|\s{2,})/g,
    trailingSeps: /(?:(}|{|]|)^[;\n\r ]+)|(?:[;\n\r ]+($|}|{|]))/g,
    rule: /^([\w-]+)(: *| +)(.*)$/,
    rule_free: /(^|\r|\n|;|{)\s*([a-z-]+)[ :][\t ]*?:?[\t ]*?([^;\r\n]+)/g,
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

const t=Symbol("Placeholder"),n=n=>{let r=0;for(const e of n)e!==t&&r++;return r},r=(n,r)=>{const e=n.length,o=n.slice(),s=r.length;let c=s,l=0;for(;c&&l<e;l++)o[l]===t&&(o[l]=r[s-c],c--);for(l=e;c;l++,c--)o[l]=r[s-c];return o},e=(t,o,s)=>{const c=t.length-o.length-n(s);if(c<1)return t(...r(o,s));{const n=(...n)=>e(t,r(o,s),n);return n.$args_left=c,n}},o=t=>(...r)=>t.length>n(r)?e(t,[],r):t(...r);function s(n){return function(r,e){const o=r===t,s=arguments.length;if(1===s&&o)throw new Error("Senseless placeholder usage.");return s>1?o?(n=>function(r){return r===t?n:n(r)})((t=>n(t,e))):n(r,e):t=>n(r,t)}}function c(t){return o(t)}const l=void 0,i=1/0,u=t=>typeof t,a=t=>null===t,f=t=>"number"==u(t),h={u:"U",b:"B",n:"N",s:"S",f:"F"},b=Symbol(),d=t=>{const n=u(t);return "object"===n?a(t)?"Null":t.constructor.name:h[n[0]]+n.slice(1)},p=t=>t.length,g=t=>a(t)||(t=>t===l)(t),m=s(((t,n)=>t===n)),w=s(((t,n)=>{const r=d(t);if(m(r,d(n))&&(m(r,"Object")||m(r,"Array"))){if(a(t)||a(n))return m(t,n);if(m(t,n))return  true;for(const r of [t,n])for(const e in r)if(!(m(r,n)&&e in t||m(r,t)&&e in n&&w(t[e],n[e])))return  false;return  true}return m(t,n)})),y=s(((t,n)=>(n.push(t),n))),z=c(((t,n,r)=>r.reduce(t,n))),A=o(((t,n,r,e)=>t(e)?n(e):r(e))),B=(...n)=>(...r)=>{let e,o=true;for(let s=p(n)-1;s>-1;s--)o?(o=false,e=n[s](...r)):e=e===t?n[s]():n[s](e);return e},S=s(((t,n)=>n[t])),j=c(((t,n,r)=>r.slice(t,f(n)?n:i))),C=S(0);j(1,i);const E=s(((t,n)=>n.find(t))),N=t=>()=>t,v=s(((t,n)=>n.split(t))),O=N(true),q=N(false),x=s(((t,n)=>z(((n,r)=>E((n=>t(r,n)),n)?n:y(r,n)),[],n)))(w),F=c(((t,n,r)=>p(n)?g(r)?t:B((e=>e in r?F(t,j(1,i,n),r[e]):t),C)(n):r));F(l),B(A(w(b),q,O),F(b));const I=s(((t,n)=>n.map(t))),{floor:M}=Math,P="0123456789abcdefghijklmnopqrstuvwxyz",U=B((t=>Object.fromEntries(t)),I(((t,n)=>[t,n])),v(""));class W{abc;abclen;c2pos;standard;setABC(t){if(!B(w(p(n=t)),p,x,v(""))(n))throw new Error("Not all chars are unique!");var n;this.abc=t,this.abclen=t.length,this.standard=P.startsWith(t),this.c2pos=U(t);}zip(t){const{abc:n,abclen:r}=this;let e="";for(;t>0;)e=n[t%r]+e,t=M(t/r);return e||"0"}unzip(t){const{standard:n,abclen:r,c2pos:e}=this;if(n)return parseInt(t,r);const o=t.length;let s=0;for(let n=0;n<o;n++)s+=e[t[n]]*r**(o-n-1);return s}constructor(t){this.setABC(t||P+"ABCDEFGHIJKLMNOPQRSTUVWXYZ");}}const k=new W;k.setABC.bind(k);k.zip.bind(k);k.unzip.bind(k);

const rules = `
top flex grid overflow transform transition-duration max-height 100%
margin margin-top margin-left margin-bottom margin-right justify-content
border width height left border-radius background bottom position align-items
center bottom absolute relative float right opacity z-index min-width
min-height border-top border-bottom border-left border-right filter
font-family font-size font-weight none hidden auto display block inline inline-block
padding padding-top padding-bottom padding-left padding-right text-align
flex-direction gap column box-shadow rotate content text-decoration max-width
fixed color space-between overflow-x overflow-y background-size
`.replace(/\s+/g, ',').split(/[, ]/g).filter(Boolean);
const zipnum = new W();
const prepareCompressRule = () => { let i = 0; return () => `a${zipnum.zip(i++)}`; };
const getDics = (pepka) => {
    const compressRule = prepareCompressRule();
    const { compose, fromPairs, qmap, qreverse, toPairs } = pepka;
    const dic = compose(fromPairs, qmap((rule) => [rule, compressRule()]))(rules);
    return { dic, dicRev: compose(fromPairs, qmap(qreverse), toPairs)(dic) };
};

let compression = false;
const setCompression = (to) => compression = to;
const dics$1 = getDics({ compose, fromPairs, qmap, qreverse, toPairs });
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
                names.push(...compose(qmap(replace(trailingColonRE, '$1')), ifElse(test(mediaRE), (l) => [l], split(delimRE)))(line));
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
        }), createFunctions(aug), qfilter(complement(isEmpty)), qmap(trim), splitNonEscaped(delimiters), replace(/(\{|\})/g, (_, brace, offset, full) => {
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
const addClassName = qassoc('className');
const addName = (name) => compose(when(always(name), addClassName(name)), when(eq(emptyObject), always({})) // Base emptyObject is frozen.
);
const getRules = (getDefStyle, style, propsOrRule, modifiers, classNames, context, name) => {
    if (!style)
        style = emptyObject;
    switch (typeof propsOrRule) {
        case types.f:
            // TODO: Better document them, the usecases?
            const an = addName(name);
            return [(props) => an(propsOrRule(props, context))];
        case types.o:
            return [addName(name)(propsOrRule)];
        case types.s:
            const rules = [];
            let combined_name = name || '';
            for (const [name, rule] of pickStyles(getDefStyle, style, propsOrRule, modifiers, context)) {
                if (classNames && name) {
                    combined_name += (length(combined_name) ? '-' : '') + name;
                    addName(combined_name)(rule);
                }
                rules.push(...getRules(getDefStyle, style, rule, modifiers, classNames, context, combined_name));
            }
            return rules;
        default:
            return [identity];
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
    ssr: false,
    classNames: false
};
class Renderer {
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
        const { method, ssr, preset, plugins, enhancers, classNames, ...miscRenderOpts } = mergeProps(defaultOpts, opts);
        const presetConfig = { ...defaultOpts.preset, ...(preset || {}) };
        const thisRenderer = this;
        // Fela renderer creation. 
        this.renderer = createRenderer({
            ...miscRenderOpts,
            enhancers,
            plugins: preparePlugins([
                unit,
                embedded,
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
            const rules = getRules(once(() => fdefValue ? fdefValue(this) : emptyObject), stylesheet, propsOrRule, modifiers ? mergeShallow(opts.modifiers, modifiers) : opts.modifiers, classNames, props);
            return renderer.renderRule(combineRules(...rules), props);
        };
        // Should be bound to Renderer.
        this.styl = (stylesheet, modifiers) => (propsOrRule, props, submodifiers) => this.renderClasses(stylesheet, propsOrRule, props, submodifiers ? mergeShallow(modifiers, submodifiers) : modifiers);
        // Mixin creation.
        this._mixin = qfilter(identity, {
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
        this.fdef = isFunction(opts.defStyles)
            ? mixin.computed.fdef
            : opts.defStyles && mixin.computed[opts.defStyles.key];
    }
}

const sc = ';';
const sp = ' ';
const prepareCompressRules = (dics, pepka) => {
    const { compose, replace, trim } = pepka;
    return compose(replace(re.trailingSeps, '$2'), replace(re.repeatingSeps, (s) => s.includes(sc) ? sc : sp), replace(re.trailing_ws, '$1'), replace(re.rule_free, (s, trailing, k, v) => v
        ? trailing +
            (k && v
                ? `${trim(dics.dic[k] || k)}:${trim(dics.dic[v] || v)};`
                : trim(k ? s.replace(k, dics.dic[k] || k)
                    : v ? s.replace(k, dics.dic[v] || v)
                        : s))
        : ''), replace(re.comment, ''));
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
