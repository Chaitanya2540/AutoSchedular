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

const scheduleJob = async (job, timeSlot, day, engineers) => {
  const engine = new Engine();

  const hasRequiredSkillsRule = {
    conditions: {
      all: job.skillsetRequired.map(skill => ({
        fact: 'engineer',
        path: 'skills',
        operator: 'contains',
        value: skill
      }))
    },
    event: {
      type: 'has-required-skills',
      params: {
        message: 'Engineer has required skills'
      }
    }
  };

  const isAvailableRule = {
    conditions: {
      all: [{
        fact: 'engineer',
        path: `availability.${day}.${timeSlot}`,
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

  engine.addRule(hasRequiredSkillsRule);
  engine.addRule(isAvailableRule);

  let eligibleEngineers = [];
  for (const engineer of engineers) {
    const { events } = await engine.run({ engineer });
    if (events.some(event => event.type === 'has-required-skills') &&
        events.some(event => event.type === 'is-available')) {
        eligibleEngineers.push(engineer);
    }
  }

  if (eligibleEngineers.length > 0) {
    // Sort eligible engineers by their rating and then by their distance to the job site
    eligibleEngineers.sort((a, b) => {
      const ratingDiff = b.rating - a.rating;
      if (ratingDiff !== 0) {
        return ratingDiff;
      } else {
        return getDistance(job.location, a.location) - getDistance(job.location, b.location);
      }
    });
    // Choose the engineer with the highest rating or closest to the job site
    const assignedEngineer = eligibleEngineers[0];
    // Update the engineer's availability
    assignedEngineer.availability[day][timeSlot] = false;

    console.log(`Job ${job.id} is assigned to engineer ${assignedEngineer.name} on ${day} at time slot ${timeSlot}`);
    return true;
  }

  return false;
};

const scheduleJobs = async () => {
  let jobs = getJobs().sort((job1, job2) => job2.priority - job1.priority);
  let engineers = getEngineers();

  const timeSlots = ["09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00"];
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  for (const job of jobs) {
    let isJobAssigned = false;
    for (const day of daysOfWeek) {
      for (const timeSlot of timeSlots) {
        isJobAssigned = await scheduleJob(job, timeSlot, day, engineers);
        if (isJobAssigned) {
          break;
        }
      }
      if (isJobAssigned) {
        break;
      }
    }
    if (!isJobAssigned) {
      console.log(`Job ${job.id} could not be assigned to any engineer.`);
    }
  }
};

scheduleJobs();
