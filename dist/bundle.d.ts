// Generated by dts-bundle-generator v7.1.0

import { TEnhancer, TPlugin } from 'fela';
import { AnyFunc } from 'pepka';

export declare const css: (strings: (string[] | TemplateStringsArray), ...values: any[]) => any;
declare const __specialcss: (strings: (string[] | TemplateStringsArray), ...values: any[]) => any;
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
		unit: [
			string,
			AnyObject
		] | [
		];
	};
	plugins: TPlugin[];
	enhancers: TEnhancer[];
	ssr: boolean;
}
export type RenderClasses = (propsOrRule: any, props?: AnyObject) => string;
export declare class Renderer {
	/** To use with fela-monolithic enhancer. */
	static devClassNames: boolean;
	private renderer;
	private _mixin;
	private renderClasses;
	/** Vue Composition API endpoint. */
	styl: (stylesheet: AnyObject) => RenderClasses;
	/** @returns Vue Options API mixin. */
	get mixin(): AnyObject;
	/** @returns Entire css for SSR proposes. */
	get style(): string;
	constructor(opts?: Partial<Options>);
}
export declare class SvelteRenderer extends Renderer {
	static get devClassNames(): boolean;
	/** To use with fela-monolithic enhancer. */
	static set devClassNames(x: boolean);
	private f;
	private fdef;
	getCSS(): (rules: AnyObject) => (className: string | AnyObject | AnyFunc, attrs?: AnyObject) => any;
	getLiteralCSS(): (template_0: string[]) => (className: string | AnyFunc<any, import("pepka").AnyArgs> | AnyObject, attrs?: AnyObject) => any;
	constructor(opts?: Partial<Options>);
}
export declare const setCompression: (to: boolean) => boolean;
export declare const rollupCSSCompression: () => {
	name: string;
	transform(code: any): Promise<{
		code: string;
		map: any;
	}>;
};

export {};
