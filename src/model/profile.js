import Mongoose, { Schema } from 'mongoose';

const profileSchema = new Schema({
  nickname: { type: String, required: true },
  tagline: { type: String },
  employer: { type: String },
  careerTagline: { type: String },
  coursework: { type: String },
  location: { type: String },
  graduationDate: { type: String },
  codeFellowsCourse: { type: String },
  relocation: { type: Boolean },
  employmentTypes: {
    fullTime: { type: Boolean },
    partTime: { type: Boolean },
    freelance: { type: Boolean },
    apprentice: { type: Boolean },
    internship: { type: Boolean },
  },
  skills: {
    top: { type: String },
    good: { type: [String] },
    learn: { type: [String ]},
  },
  tools: {
    top: { type: String },
    good: { type: [String] },
    learn: { type: [String] },
  },
  roles: {
    top: { type: String },
    other: { type: [String] },
  },
  email: { type: String },
  salesforceId: { type: String },
});

const Profile = Mongoose.model('profile', profileSchema);

export default Profile;
