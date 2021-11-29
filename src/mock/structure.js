import { getRandomInteger } from './utils.js';


const descriptionOptions = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Cras aliquet varius magna, non porta ligula feugiat eget.', 'Fusce tristique felis at fermentum pharetra.', 'Aliquam id orci ut lectus varius viverra.', 'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.', 'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.', 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.', 'Sed sed nisi sed augue convallis suscipit in sed felis.', 'Aliquam erat volutpat.', 'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'];

export const getRandomDescription = () => {
  const descriptions = [];
  for (let i = 0; i < getRandomInteger(1, 5); i++) {
    descriptions.push(descriptionOptions[getRandomInteger(0, descriptionOptions.length - 1)]);
  }
  return descriptions;
};
const emotionOptions = ['smile', 'sleeping', 'puke', 'angry'];

const getRandomEmotion = () => emotionOptions[getRandomInteger(0, emotionOptions.length - 1)];

const generateComment = () => {
  const comment = {};
  comment.id = getRandomInteger(0, 100);
  comment.author = 'Ilya';
  comment.comment = 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.';
  comment.date = '2019-05-11T16:12:32.554Z';
  comment.emotion = getRandomEmotion();
  return comment;
};

const commentStructure = {
  'id': getRandomInteger(0, 100),
  'author': 'Ilya',
  'comment': 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  'date': '2019-05-11T16:12:32.554Z',
  'emotion': getRandomEmotion(),
};

export const getCommentsList = () => {
  const comments = [];
  for (let i = 0; i < getRandomInteger(0, 5); i++) {
    comments.push(generateComment());
  }
  return comments;
};


