import gradient from 'gradient-string';
import TITLE_TEXT from '../config/text.config.js';

const poimandresTheme = {
  purple: '#FAAEFC',
  blue: '#12DFF3',
};

export const renderTitle = () => {
  const t3Gradient = gradient(Object.values(poimandresTheme));

  console.log(t3Gradient.multiline(TITLE_TEXT));
};
