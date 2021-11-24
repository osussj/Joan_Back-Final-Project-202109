import { Schema, model, Types, ObjectId } from "mongoose";

interface IChallenge {
  name: string;
  questions: ObjectId[];
}

const challengeSchema: Schema<IChallenge> = new Schema({
  name: {
    type: String,
    required: true,
  },
  questions: {
    type: [Types.ObjectId],
    ref: "Question",
  },
});

const Challenge = model<IChallenge>("Challenge", challengeSchema, "challenges");

export default Challenge;
