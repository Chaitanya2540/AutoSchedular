# Job Scheduling Application

## Overview

This application is designed to help organizations, especially those in the engineering industry, to effectively schedule and assign jobs to their engineers. The scheduling is based on several parameters such as the skillset required for a job, availability of the engineers, their ratings and their geographical location relative to the job site. The application makes use of rule-based programming to implement the scheduling logic.

## Problem Statement

Organizations often struggle with the optimal assignment of jobs to their employees. Factors like skillset, availability, rating and geographical proximity to the job site can greatly affect job performance and efficiency. However, considering all these factors and making the best assignment manually can be a daunting and time-consuming task. 

## The Solution

The solution provided by this application is an automatic job scheduling mechanism. It takes into account:

- **Skillset**: The job's required skills are compared with the skillset of each engineer. Only those who possess all the necessary skills are considered for the job.
- **Availability**: The engineer's availability during the job's time slot is checked. The job is only scheduled during a time slot when the engineer is available.
- **Rating**: Among all eligible engineers, those with a higher rating are given preference.
- **Proximity to the job site**: If multiple engineers have the same rating, the one closer to the job site is preferred. 

The algorithm is designed to give priority to the jobs with a higher priority value. If a job cannot be assigned to any engineer, the application logs an appropriate message.

## Target Audience

The primary users of this application are organizations with a team of engineers or similar roles that need to be assigned jobs based on their skillsets, availability, ratings, and geographical proximity to the job site.

## Running the Project

Before running the project, make sure you have Node.js installed on your machine.

1. Clone the repository: `git clone <repository_url>`
2. Navigate to the project directory: `cd <project_directory>`
3. Install the required dependencies: `npm install`
4. To run the application, use: `node <your_file_name>.js`

**Note:** Replace `<repository_url>` with the URL of your repository, `<project_directory>` with the directory of your project, and `<your_file_name>` with the name of the .js file.

## Data Format

The application reads jobs and engineers data from 'jobs.json' and 'engineers.json' respectively. Make sure these files exist in your project directory and follow the correct format.

**Jobs.json**:

```json
[
  {
    "id": "1",
    "skillsetRequired": ["Skill1", "Skill2"],
    "location": { "lat": 34.0522, "long": -118.2437 },
    "priority": 1
  },
  ...
]
```

**Engineers.json**:

```json
[
  {
    "name": "Engineer1",
    "skills": ["Skill1", "Skill2", "Skill3"],
    "rating": 4.8,
    "location": { "lat": 37.7749, "long": -122.4194 },
    "availability": { "Monday": { "09:00-10:00": true, ... }, ... }
  },
  ...
]
```

The `availability` field represents the availability of the engineer for each timeslot on each day of the week. If the value is `true`, the engineer is available during that timeslot; if it's `false`, they are not available.
