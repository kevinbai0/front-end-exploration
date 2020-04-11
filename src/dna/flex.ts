import { ThemeObject, ThemeExtension, FlexGridDisplayOptions } from "../theme/index.d";

export const injectFlexGridDisplayOptions = <T extends FlexGridDisplayOptions & ThemeObject<ThemeExtension>>(props: T) => `
    ${props.align ? `align-items: ${props.align};` : ""}
    ${props.justify ? `
        justify-items: ${props.justify};
        justify-content: ${props.justify};
    ` : ""}
    ${props.rows ? `grid-template-rows: ${props.rows};` : ""}
    ${props.columns ? `grid-template-columns: ${props.columns};` : ""}
    ${props.gap ? `grid-gap: ${props.gap}px;` : ""}
    ${props.rowGap ? `grid-row-gap: ${props.rowGap}px;` : ""}
    ${props.columnGap ? `grid-template-rows: ${props.columnGap}px;` : ""}
`;
