interface AnyObject {
    [key: string]: any;
}
interface Options {
    method: string;
    fdef: (vm: AnyObject) => AnyObject;
    ssr: boolean;
}
declare class Renderer {
    renderer: import("fela").IRenderer;
    mixin: AnyObject;
    constructor(opts?: Partial<Options>);
}
declare const getStyle: (renderer: Renderer) => any;
export { Renderer, getStyle };
