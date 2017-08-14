import { Router } from 'express';

const profileRouter = new Router();

const uri = `${process.env.API_URI}/profiles`;
console.log('profiles uri: ', uri);

const testProfile = {
  nickname: 'Sparky',
  tagline: 'High energy developer with an electric personality',
  employer: 'Lead developer at Hi Voltage',
  careerTagline: 'Former electrical linesman converted to web dev',
  coursework: 'Associates in electrical work, Pierce College',
  location: 'Seattle, WA',
  graduationDate: '8/18/2017',
  codeFellowsCourse: 'Code 401 Full Stack Javascript',
  relocation: false,
  employmentTypes: {
    fullTime: true,
    partTime: false,
    freelance: true,
    apprentice: false,
    internship: true,
    // if all are false -> not seeking employment at this time
  },
  skills: {
    top: 'JavaScript',
    good: ['Java', 'React', 'Dev-Ops'],
    learn: ['Angular', 'Test Automation'],
  },
  tools: {
    top: 'GitHub',
    good: ['Git', 'AWS'],
    learn: ['Mongo', 'Vim'],
  },
  roles: {
    top: 'Back-end Developer',
    other: ['Software Engineer', 'Dev-Ops'],
  },
};

profileRouter.get(uri, (req, res) => {
  console.log('Serving a static profile for dev porpoises');
  res.json(testProfile);
});

export default profileRouter;
