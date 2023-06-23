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

const getDistance = (location1, location2) => {
  const toRadians = (degrees) => degrees * Math.PI / 180;

  const lat1 = toRadians(location1.lat);
  const long1 = toRadians(location1.long);
  const lat2 = toRadians(location2.lat);
  const long2 = toRadians(location2.long);

  const deltaLat = lat2 - lat1;
  const deltaLong = long2 - long1;

  const a = Math.pow(Math.sin(deltaLat / 2), 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLong / 2), 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Earth radius in kilometers
  const earthRadius = 6371;

  return earthRadius * c;
};

const calculateScore = (distance, engineerRating, jobPriority) => {
  // Here, we are subtracting distance, as we want engineers closer to the job location to have higher scores.
  // We are also subtracting jobPriority, as a lower priority number means a higher priority job.
  return engineerRating - distance - jobPriority;
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

  let bestEngineer = null;
  let bestScore = -Infinity;

  for (const engineer of engineers) {
    const { events } = await engine.run({ engineer });

    if (events.some(event => event.type === 'has-required-skill') &&
        events.some(event => event.type === 'is-available')) {

      const distance = getDistance(job.location, engineer.location);
      const score = calculateScore(distance, engineer.rating, job.priority);

      if (score > bestScore) {
        bestScore = score;
        bestEngineer = engineer;
      }
    }
  }

  if (bestEngineer) {
    console.log(`Job ${job.id} is assigned to engineer ${bestEngineer.name}`);

    // Update engineer's availability in engineers.json
    engineers = engineers.map(e => {
      if (e.id === bestEngineer.id) {
        e.availability[timeSlotKey] = false;
      }
      return e;
    });

    fs.writeFileSync('engineers.json', JSON.stringify(engineers, null, 2), 'utf-8');
  } else {
    console.log(`No suitable engineer found for job ${job.id}`);
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

// We sort jobs by priority before scheduling
const jobs = getJobs().sort((job1, job2) => job1.priority - job2.priority);

for (const timeSlot of timeSlots) {
  const jobsInTimeSlot = jobs.filter(job => job.timeSlot[0] === timeSlot[0] && job.timeSlot[1] === timeSlot[1]);
  for (const job of jobsInTimeSlot) {
    scheduleJob(job);
  }
}
