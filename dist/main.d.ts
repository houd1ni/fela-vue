import { TPlugin, TEnhancer } from 'fela';
interface AnyObject {
    [key: string]: any;
}
interface Options {
    method: string;
    defStyles?: ((vm?: AnyObject) => AnyObject) | {
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
declare class Renderer {
    private renderer;
    private _mixin;
    readonly mixin: AnyObject;
    readonly style: string;
    constructor(opts?: Partial<Options>);
}
export { Renderer };