import { AnyObject, Options } from './types';
declare class Renderer {
    private renderer;
    private _mixin;
    readonly mixin: AnyObject;
    readonly style: string;
    constructor(opts?: Partial<Options>);
}
export * from './css-lit';
export { Renderer };
