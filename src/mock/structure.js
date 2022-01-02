import { getRandomInteger } from './utils.js';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import dayjsRandom from 'dayjs-random';

const DESCRIPTION_OPTIONS = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Cras aliquet varius magna, non porta ligula feugiat eget.', 'Fusce tristique felis at fermentum pharetra.', 'Aliquam id orci ut lectus varius viverra.', 'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.', 'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.', 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.', 'Sed sed nisi sed augue convallis suscipit in sed felis.', 'Aliquam erat volutpat.', 'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'];

dayjs.extend(dayjsRandom);

export const getRandomDescription = () => {
  const descriptions = [];
  for (let i = 0; i < getRandomInteger(1, 5); i++) {
    descriptions.push(DESCRIPTION_OPTIONS[getRandomInteger(0, DESCRIPTION_OPTIONS.length - 1)]);
  }
  return descriptions;
};
const EMOTION_OPTIONS = ['smile', 'sleeping', 'puke', 'angry'];

const getRandomEmotion = () => EMOTION_OPTIONS[getRandomInteger(0, EMOTION_OPTIONS.length - 1)];

export const generateComment = () => ({
  id: nanoid(),
  author: 'Ilya',
  comment: 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  date: dayjs.between('2010-06-10', '2022-03-02').format('YYYY/MM/DD HH:mm'),
  emotion: getRandomEmotion(),
});

export const getCommentsList = () => {
  const comments = [];
  for (let i = 0; i < getRandomInteger(0, 5); i++) {
    comments.push(generateComment());
  }
  return comments;
};


