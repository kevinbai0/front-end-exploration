import { generateMedia } from './base/media';
import { generateFonts } from './base/fonts';
import { generateLayout } from './base/layout';
import { generateColors } from './base/colors';
import { generateSpacing } from './base/spacing';
import { applyGenerator as transformer } from './process';

const themeDna = {
  generateMedia,
  generateFonts,
  generateLayout,
  generateColors,
  generateSpacing,
};

export { createFactory } from './base/factory';
export { themeDna };
export { transformer };
