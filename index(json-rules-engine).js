const { Engine } = require('json-rules-engine');
const fs = require('fs');

const getJobs = () => {
  const jobs = JSON.parse(fs.readFileSync('jobs.json', 'utf-8'));
  return jobs;
};

const getEngineers = () => {
  const engineers = JSON.parse(fs.readFileSync('engineers.json', 'utf-8'));
  return engineers;
};

const scheduleJob = async (job) => {
  let engineers = getEngineers();
  const timeSlotKey = `${job.timeSlot[0]}-${job.timeSlot[1]}`;

  const engine = new Engine();

  const hasRequiredSkillRule = {
    conditions: {
      all: [{
        fact: 'engineer',
        path: 'skills',
        operator: 'contains',
        value: job.skillRequired
      }]
    },
    event: {
      type: 'has-required-skill',
      params: {
        message: 'Engineer has required skill'
      }
    }
  };

  const isAvailableRule = {
    conditions: {
      all: [{
        fact: 'engineer',
        path: `availability.${timeSlotKey}`,
        operator: 'equal',
        value: true
      }]
    },
    event: {
      type: 'is-available',
      params: {
        message: 'Engineer is available during job timeslot'
      }
    }
  };

  engine.addRule(hasRequiredSkillRule);
  engine.addRule(isAvailableRule);

  for (const engineer of engineers) {
    const { events } = await engine.run({ engineer });

    if (events.some(event => event.type === 'has-required-skill') &&
        events.some(event => event.type === 'is-available')) {

      console.log(`Job ${job.id} is assigned to engineer ${engineer.name}`);
      
      // Update engineer's availability in engineers.json
      engineers = engineers.map(e => {
        if (e.id === engineer.id) {
          e.availability[timeSlotKey] = false;
        }
        return e;
      });
      
      fs.writeFileSync('engineers.json', JSON.stringify(engineers, null, 2), 'utf-8');
      
      // Break the loop as soon as a job is assigned
      break;
    }
  }
};

const timeSlots = [
  ["09:00", "10:00"],
  ["10:00", "11:00"],
  ["11:00", "12:00"],
  ["12:00", "13:00"],
  ["13:00", "14:00"],
  ["14:00", "15:00"],
  ["15:00", "16:00"],
  ["16:00", "17:00"],
  ["17:00", "18:00"],
  ["18:00", "19:00"]
];

for (const timeSlot of timeSlots) {
  const jobs = getJobs().filter(job => job.timeSlot[0] === timeSlot[0] && job.timeSlot[1] === timeSlot[1]);
  for (const job of jobs) {
    scheduleJob(job);
  }
}
