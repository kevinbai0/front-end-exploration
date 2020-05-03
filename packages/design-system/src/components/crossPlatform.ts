import { DNA, ThemeObject, ThemeExtension } from "../theme/types";

export type PlatformType = "react" | "react-native";
export type CrossPlatformFn = (props: DNA<ThemeExtension> & ThemeObject<ThemeExtension>, platform: PlatformType) => string