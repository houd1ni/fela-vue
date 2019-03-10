interface AnyObject {
    [key: string]: any;
}
interface Options {
    method: string;
    fdef: (vm: AnyObject) => AnyObject;
    ssr: boolean;
    plugins: any[];
}
declare class Renderer {
    private renderer;
    private _mixin;
    readonly mixin: AnyObject;
    readonly style: string;
    constructor(opts?: Partial<Options>);
}
export { Renderer };
