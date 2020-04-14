import { DNA, ThemeObject } from "../theme/types";

export type PlatformType = "react" | "react-native";
export type CrossPlatformFn = (props: DNA & ThemeObject, platform: PlatformType) => string