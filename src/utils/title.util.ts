import gradient from 'gradient-string';
import TITLE_TEXT from '../config/text.config.js';

const poimandresTheme = {
  blue: '#add7ff',
  cyan: '#89ddff',
  green: '#5de4c7',
  magenta: '#fae4fc',
  red: '#d0679d',
  yellow: '#fffac2',
};

export const renderTitle = () => {
  const t3Gradient = gradient(Object.values(poimandresTheme));

  console.log(t3Gradient.multiline(TITLE_TEXT));
};
