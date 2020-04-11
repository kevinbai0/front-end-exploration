import { Spacing, ThemeObject, ThemeExtension } from "../theme/index.d";

export const injectSpace = <T extends Spacing & ThemeObject<ThemeExtension>>(props: T) => `
    ${props.m && `margin: ${props.m}px;`};
    ${props.p && `padding: ${props.p}px;`};

    ${props.px && `
        padding-left: ${props.px}px;
        padding-right: ${props.px}px;
    `};
    ${props.py && `
        padding-bottom: ${props.py}px;
        padding-top: ${props.py}px;
    `};
    ${props.mx && `
        margin-left: ${props.mx}px;
        margin-right: ${props.mx}px;
    `};
    ${props.my && `
        margin-top: ${props.my}px;
        margin-bottom: ${props.my}px;
    `};

    ${props.ml && `margin-left: ${props.ml}px`};
    ${props.mr && `margin-right: ${props.mr}px`};
    ${props.mt && `margin-top: ${props.mt}px`};
    ${props.mb && `margin-bottom: ${props.mb}px`};
    ${props.pl && `padding-left: ${props.pl}px`};
    ${props.pr && `padding-right: ${props.pr}px`};
    ${props.pt && `padding-top: ${props.pt}px`};
    ${props.pb && `padding-bottom: ${props.pb}px`};
`
