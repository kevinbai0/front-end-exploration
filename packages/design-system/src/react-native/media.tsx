import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('screen');

const ratio = (w: number, h: number) => {
  return (w / h).toFixed(2);
};

const iPhoneXClassRatio = ratio(375, 812);

const screenRatio = ratio(width, height);

// width sizing:
/**
 * Small: <= 375px
 * Medium: <= 414px
 */
// ratio sizing:
/**
 * Regular: iPhone 8
 * Tall: iPhone X
 */

export const media = {
  get iPhoneXClass() {
    return screenRatio === iPhoneXClassRatio && Platform.OS === 'ios';
  },
  get iPhone8() {
    return width <= 375 && !this.iPhoneXClass;
  },
  get iPhoneX() {
    return width <= 375 && this.iPhoneXClass;
  },
  get iPhoneXMax() {
    return width <= 414;
  },
  responsiveWidth: function <T>(sizes: { small: T; medium: T; else?: T }) {
    if (width <= 375) {
      return sizes.small;
    } else if (width <= 414) {
      return sizes.medium;
    }
    return sizes.else ?? sizes.medium;
  },
  responsiveDevice: function <T>(classes: {
    iPhoneX: T;
    iPhoneXMax?: T;
    iPhone8: T;
    iPhone8Plus?: T;
  }) {
    if (this.iPhoneXClass) {
      return this.responsiveWidth({
        small: classes.iPhoneX,
        medium: classes.iPhoneXMax ?? classes.iPhoneX,
      });
    } else {
      return this.responsiveWidth({
        small: classes.iPhone8,
        medium: classes.iPhone8Plus ?? classes.iPhone8,
      });
    }
  },
} as const;
