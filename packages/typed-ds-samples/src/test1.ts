import { fontFactory, colorsFactory, mediaFactory,layoutFactory, spaceFactory, themeFactory, createCssInJsTransformer, generator } from 'typed-ds'
import { generate } from 'typed-ds/build/types/src/base/media'

const media = mediaFactory.generate({
  breakpoints: {
    tablet: '600px',
    desktop: '700px',
  },
  selectors: []
})

const colors = colorsFactory.generate({
  white: '#ff'
})

const fonts = fontFactory.generate<typeof media>()({
  properties: {
    family: {
      main: 'Helvetica'
    },
    weight: {
      normal: 200
    },
    sizeClass: {
      h1: ['24px', '28px', '1px']
    }
  },
  aliases: {
    h1: {
      family: 'main',
      weight: 'normal',
      sizeClass: 'h1'
    }
  }
})

const spacing = spaceFactory.generate({
  baseMultiplier: '4px',
  aliases: {}
})
const layout = layoutFactory.generate<typeof media>()({
  properties: {
    display: {
      row: 'row',
      col: 'column'
    },
    align: {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      stretch: 'stretch'
    },
    justify: {
      'even': 'space-evenly',
      justify: 'space-between'
    }
  },
  aliases: {}
})

const factory = themeFactory.generate({
  media, 
  spacing,
  colors,
  fonts,
  layout
})


const applier = generator(media, factory, createCssInJsTransformer())

console.log(applier({
  bg: 'white',
  m: _ => ['1x', _.desktop('3x')]
}))