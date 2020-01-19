import styled from 'styled-components';
import { SystemBody } from './SystemComponents';
import { variant, space } from 'styled-system';

const Body = styled(SystemBody)(
    {
        margin: 0,
        variant: "default"
    },
    variant({
        variants: {
            default: {},
            big: {
                fontSize: 1
            }
        }
    }),
    space
);



export default Body;