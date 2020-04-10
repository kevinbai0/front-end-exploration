import { Spacing, ThemeObject, ThemeExtension } from "../theme/index.d";

export const injectSpace = <T extends Spacing & ThemeObject<ThemeExtension>>(props: T) => `
    ${props.ml && `margin-left: ${props.ml}px`};
    ${props.mr && `margin-right: ${props.mr}px`};
    ${props.mt && `margin-top: ${props.mt}px`};
    ${props.mb && `margin-bottom: ${props.mb}px`};
    ${props.pl && `padding-left: ${props.pl}px`};
    ${props.pr && `padding-right: ${props.pr}px`};
    ${props.pt && `padding-top: ${props.pt}px`};
    ${props.pb && `padding-bottom: ${props.pb}px`};
    ${props.m && `margin: ${props.m};`};
    ${props.p && `padding: ${props.p};`};
`
