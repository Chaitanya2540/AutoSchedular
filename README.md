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
    "skillsetRequired": ["a","k"],
    "location": {
      "lat": 40.712776,
      "long": -74.005974
    },
    "priority": 3
  },
  {
    "id": "2",
    "skillsetRequired": ["b","l"],
    "location": {
      "lat": 40.712776,
      "long": -74.005974
    },
    "priority": 1
  }
]
```

**Engineers.json**:

```json
[
  {
    "id": "1",
    "name": "Chetan Wadhwani",
    "skills": [
      "a","k"
    ],
    "availability": {
      "Monday": {
        "09:00-10:00": true,
        "10:00-11:00": true,
        "11:00-12:00": true,
        "12:00-13:00": true,
        "13:00-14:00": true,
        "14:00-15:00": true,
        "15:00-16:00": true,
        "16:00-17:00": true,
        "17:00-18:00": true,
        "18:00-19:00": true
      },
      "Tuesday": {
        "09:00-10:00": true,
        "10:00-11:00": true,
        "11:00-12:00": true,
        "12:00-13:00": true,
        "13:00-14:00": true,
        "14:00-15:00": true,
        "15:00-16:00": true,
        "16:00-17:00": true,
        "17:00-18:00": true,
        "18:00-19:00": true
      },
      "Wednesday": {
        "09:00-10:00": true,
        "10:00-11:00": true,
        "11:00-12:00": true,
        "12:00-13:00": true,
        "13:00-14:00": true,
        "14:00-15:00": true,
        "15:00-16:00": true,
        "16:00-17:00": true,
        "17:00-18:00": true,
        "18:00-19:00": true
      },
      "Thursday": {
        "09:00-10:00": true,
        "10:00-11:00": true,
        "11:00-12:00": true,
        "12:00-13:00": true,
        "13:00-14:00": true,
        "14:00-15:00": true,
        "15:00-16:00": true,
        "16:00-17:00": true,
        "17:00-18:00": true,
        "18:00-19:00": true
      },
      "Friday": {
        "09:00-10:00": true,
        "10:00-11:00": true,
        "11:00-12:00": true,
        "12:00-13:00": true,
        "13:00-14:00": true,
        "14:00-15:00": true,
        "15:00-16:00": true,
        "16:00-17:00": true,
        "17:00-18:00": true,
        "18:00-19:00": true
      }
    },
    "location": {
      "lat": 40.712,
      "long": -74.005974
    },
    "rating": 3
  }
]
```

The `availability` field represents the availability of the engineer for each timeslot on each day of the week. If the value is `true`, the engineer is available during that timeslot; if it's `false`, they are not available.


## Dependencies

The project uses the following dependencies:

1. `json-rules-engine`: A JSON-based rules engine that executes when certain criteria are met.
2. `fs`: A built-in Node.js file system module for handling file I/O operations.

## How to Run the Project

Before running the project, make sure you have Node.js and NPM (Node Package Manager) installed on your machine. If not, you can download it from [here](https://nodejs.org/en/download/).

Follow the steps below to run this project:

1. **Clone the Repository**

   You can clone the repository by running the following command in your terminal:

   ```bash
   git clone <repository-url>
   ```

   Replace `<repository-url>` with the URL of this repository.

2. **Navigate to the Project Directory**

   Change your current directory to the project directory by running:

   ```bash
   cd <project-directory>
   ```

   Replace `<project-directory>` with the name of the directory where the project is located.

3. **Install Dependencies**

   This project requires the `json-rules-engine` package. You can install it by running the following command in your terminal:

   ```bash
   npm install json-rules-engine
   ```

4. **Run the Project**

   You can run the project by running the following command in your terminal:

   ```bash
   node index.js
   ```

Please note that `index.js` is the main entry point of your application. If your entry point is different, replace `index.js` with your actual entry point file.

## Example 

For instance, if your repository URL is `https://github.com/username/repo.git` and your project directory is `job-scheduler`, the commands will look like this:

```bash
git clone https://github.com/username/repo.git
cd job-scheduler
npm install json-rules-engine
node index.js
```

## Error Handling

You might encounter a message saying "Job ${job.id} could not be assigned to any engineer." This message means that there was no engineer available with the required skills, at the needed time, who is close enough to the job site. 

## Output

The program logs messages to the console for each job, indicating which engineer (if any) the job was assigned to, and when. If a job could not be assigned to any engineer, it logs a message indicating this.

---
