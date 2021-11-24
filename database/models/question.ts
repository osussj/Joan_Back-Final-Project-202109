import { model, Schema } from "mongoose";

interface IQuestion {
  question: string;
  answer: string;
  hint: string;
}

const questionSchema: Schema<IQuestion> = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  hint: {
    type: String,
    required: true,
  },
});

const Question = model<IQuestion>("Question", questionSchema, "questions");

export default Question;
