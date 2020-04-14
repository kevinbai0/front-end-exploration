import { DNA, ThemeObject } from "../theme/index.d";

export type PlatformType = "react" | "react-native";
export type CrossPlatformFn = (props: DNA & ThemeObject, platform: PlatformType) => string