import * as yup from 'yup';

export const CreatePostSchema = yup.object().shape({
  content: yup.string().required().min(4).max(512),
  note: yup.string().min(4).max(128),
});
