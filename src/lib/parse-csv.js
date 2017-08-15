import parse from 'csv-parse';

const csvFieldToKey = {
  'Your email address, be sure to use the one we already have on record: ': 'email',
  'SalesForce Contact ID': 'salesforceId',
  'Choose a nickname. ': 'nickname',
  'Choose a "tagline" that briefly describes who you are.': 'tagline',
  'If you\'re currently working in-field, including working for Code Fellows as a TA, enter your title and company.': 'employer',
  'Choose a tagline that describes your career timeline prior to coming to Code Fellows.  ': 'careerTagline',
  'Describe any coursework you\'ve done beyond high school. ': 'coursework',
  'The city and state you\'d ideally work in or near.': 'location',
  'The date you graduated from your first Code Fellows 401:': 'graduationDate',
  'The name of the first Code Fellows 401 course you graduated from:': 'codeFellowsCourse',
  'Are you open to discussing relocation?': 'relocation',
  'What types of employment are you seeking or open to?': 'employmentTypes',
};

const employmentTypeToKey = {
  'Full-time': 'fullTime',
  'Part-time': 'partTime',
  'Apprentice': 'apprentice',
  'Paid internship': 'internship',
  'Freelance or contract work': 'freelance',
};

const findKeysWithPartial = (object, partial) =>
  Object.keys(object)
    .filter(key => key.includes(partial))
    .reduce((obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {});

const parseCSV = csv => {
  return new Promise((resolve, reject) => {
    parse(csv, { columns: true }, (err, output) => {
      if(err) {
        return reject(err);
      }
      const result = output.map(profile => {
        const prof = {};
        Object.keys(profile).forEach(key => {
          if(key in csvFieldToKey) {
            prof[csvFieldToKey[key]] = profile[key];
          }
        });
        prof.relocation = prof.relocation === 'Yes';
        prof.employmentTypes = Object.keys(employmentTypeToKey).reduce((res, key) => {
          res[employmentTypeToKey[key]] = prof.employmentTypes.includes(key);
          return res;
        }, {});
        prof.skills = {};
        prof.skills.good = [];
        prof.skills.learn = [];
        const find = str => findKeysWithPartial(profile, str);
        const skills = find('skill');
        for(let skill in skills) {
          // regexp matches everything between [ ]
          const name = skill.match(/\[(.*?)\]/)[1];
          if(skills[skill].includes('Top Favorite'))
            prof.skills.top = name;
          else if(skills[skill].includes('pretty good'))
            prof.skills.good.push(name);
          else if(skills[skill].includes('learn more'))
            prof.skills.learn.push(name);
        }
        prof.tools = {};
        prof.tools.good = [];
        prof.tools.learn = [];
        const tools = find('tools');
        for(let tool in tools) {
          const name = tool.match(/\[(.*?)\]/)[1];
          if(tools[tool].includes('Top Favorite'))
            prof.tools.top = name;
          else if(tools[tool].includes('pretty good'))
            prof.tools.good.push(name);
          else if(tools[tool].includes('learn more'))
            prof.tools.learn.push(name);
        }
        prof.roles = {};
        prof.roles.other = [];
        const roles = find('roles');
        for(let role in roles) {
          const name = role.match(/\[(.*?)\]/)[1];
          if(roles[role].includes('Top Favorite'))
            prof.roles.top = name;
          else if(roles[role].includes('love'))
            prof.roles.other.push(name);
        }
        return prof;
      });

      return resolve(result);
    });
  });
};

export default parseCSV;
