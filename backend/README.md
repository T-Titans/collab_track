CollabTrack - Development Backend

This is a lightweight ExpressJS backend used for local development and testing with the CollabTrack frontend.

Quick start

1. Open a terminal and change into the server directory:

   cd server

2. Install dependencies:

   npm install

3. Start the server in development mode (uses nodemon):

   npm run dev

The API will listen on port 5000 by default and expose endpoints under /api (e.g. http://localhost:5000/api).

Environment variables

- FRONTEND_URL (optional): the allowed CORS origin. Default: http://localhost:3000
- PORT (optional): the port to listen on. Default: 5000
- JWT_SECRET (optional): secret for signing JWTs. Default: dev_jwt_secret

Notes

This server uses MongoDB (via Mongoose) as its development datastore. Do not use the development configuration in production.

Now this repository includes a Mongo-based backend using Mongoose. To use it:

1. Create `server/.env` based on `.env.example` and set `MONGO_URI`, `JWT_SECRET`, etc.
2. Install server dependencies:

   cd server; npm install

3. Run the seed script to populate demo data:

   npm run seed

4. Start the server:

   npm run dev

The seeded demo users (password: password123) are:
  - admin@collabtrack.com (Admin)
  - pm@collabtrack.com (Project Manager)
  - member@collabtrack.com (Team Member)

