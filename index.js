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

const scheduleJob = (job) => {
  const engineers = getEngineers();
  const timeSlotKey = `${job.timeSlot[0]}-${job.timeSlot[1]}`;

  const availableEngineers = engineers.filter((engineer) => {
    const hasSkill = engineer.skills.includes(job.skillRequired);
    const isAvailable = engineer.availability[timeSlotKey] === true;
    return hasSkill && isAvailable;
  });

  let closestEngineer = null;
  let minDistance = Infinity;

  for (const engineer of availableEngineers) {
    const distance = getDistance(job.location, engineer.location);
    if (distance < minDistance) {
      minDistance = distance;
      closestEngineer = engineer;
    }
  }

  if (closestEngineer === null) {
    console.log(`No engineer available for job ${job.id}`);
  } else {
    console.log(`Job ${job.id} is assigned to engineer ${closestEngineer.name}`);
  }
};

const jobs = getJobs();
for (const job of jobs) {
  scheduleJob(job);
}
