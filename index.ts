import { ThemeExtension, createTheme, Theme, ThemeColor } from "./src/theme/index";
import styled from "styled-components";

const newTheme = {
    colors: {
        blue: "blue"
    }
}

type NewTheme = typeof newTheme
export interface Extension extends ThemeExtension, NewTheme {

}

const theme = createTheme(newTheme)