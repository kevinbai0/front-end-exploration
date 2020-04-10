import { Theme, ThemeExtension } from "./index";

export type ThemeObject<T> = {
    theme: Theme<T>
}

declare module "styled-components" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface DefaultTheme extends Theme<ThemeExtension> {}
}