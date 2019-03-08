interface AnyObject {
    [key: string]: any;
}
interface Options {
    method: string;
    fdef: (vm: AnyObject) => AnyObject;
}
declare const _default: (opts: Partial<Options>) => {
    methods: {
        [x: string]: (propsOrRule: any, props?: AnyObject) => string;
    };
    computed: {
        fdef(): AnyObject;
    };
};
export default _default;
