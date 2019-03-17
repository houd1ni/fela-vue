
export const always = (a: any) => () => a
export const reflect = (a: any) => a
export const camelify = (str: string) => str.replace(/-(\w)/gu, (_s, l) => l.toUpperCase())
export const last = (a: any[] | string) => a[a.length-1]