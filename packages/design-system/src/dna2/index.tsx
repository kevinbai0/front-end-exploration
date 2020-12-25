import { generateMedia, MediaProperty } from "./media";

const globalBreakpoints = {
  tablet: 768,
  desktop: 1024,
  xLarge: 1440
} as const;

const { media } = generateMedia(globalBreakpoints);
type MediaValue<T> = MediaProperty<T, typeof globalBreakpoints>


interface IProps {
  

}

const A: React.FC<IProps> =() => {
  return (
    <div></div>
  )
}

<A
  hover$fg={media(12).tablet(10)}
  hover$bg={''}
/>