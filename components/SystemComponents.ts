import styled from 'styled-components';
import { grid, color, space, layout, typography, flexbox, compose, shadow, border, position } from 'styled-system';

export const composition = compose(grid, color, space, flexbox, layout, typography, shadow, border, position);

export const SystemComponent = styled.div(composition);
export const SystemSpan = styled.span(composition);
export const SystemHeader = {
    H1: styled.h1(composition),
    H2: styled.h2(composition),
    H3: styled.h3(composition),
    H4: styled.h4(composition),
    H5: styled.h5(composition),
    H6: styled.h6(composition)
};
export const SystemBody = styled.p(composition);
export const SystemLink = styled.a(composition);
export const SystemButton = styled.button(composition);

export const SystemImage = styled.img(composition);
export const SystemLabel = styled.label(composition);
export const SystemInput = styled.input(composition);
export const SystemNav = styled.nav(composition);
export const SystemSvg = styled.svg(composition);