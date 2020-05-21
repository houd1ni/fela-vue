import { TEnhancer, TPlugin } from 'fela';
import { AnyFunc } from 'pepka';

export interface AnyObject {
	[key: string]: any;
}
export interface Options {
	method: string;
	defStyles?: ((vm: AnyObject) => AnyObject) | {
		key: string;
		value: ((vm?: AnyObject) => AnyObject);
	};
	preset: {
		unit: [string, AnyObject] | [];
	};
	plugins: TPlugin[];
	enhancers: TEnhancer[];
	ssr: boolean;
}
export declare const css: (strings: string[] | TemplateStringsArray, ...values: any[]) => any;
export declare class SvelteRenderer {
	private f;
	private fdef;
	getCSS(): (rules: AnyObject) => (className: string | AnyFunc | AnyObject, attrs?: AnyObject) => any;
	getLiteralCSS(): (template_0: string[]) => (className: string | AnyFunc | AnyObject, attrs?: AnyObject) => any;
	constructor(opts?: Partial<Options>);
}
export declare class Renderer {
	private renderer;
	private _mixin;
	get mixin(): AnyObject;
	get style(): string;
	constructor(opts?: Partial<Options>);
}

export {};
