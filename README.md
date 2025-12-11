This is a backend and frontend for the weatherstack API which is being done for the project in CWEB280
Here is some information of what libraries were used
node js, express, knex, sqlite, JWT, bycriptjs, uuid, helmet, cors, dotenv, express-validator, jest, supertest, nodemon. The frontend uses Vue. 
To use it you must install npm. You can test running the server by using npm run dev
For the databse migrations run npm run db:setup
Use npm test to run the tests and see if they worked. To run the frontend open another terminal
window and type cd frontend and then npm run dev, both must be running.
use this for the .env: npm install dotenv --save
this is an example of the env, since the real one includes private information:
PORT=4000
NODE_ENV=development
DATABASE_FILENAME=./data/dev.sqlite
JWT_SECRET=jwt_secret
JWT_EXPIRES_IN=1h
WEATHERSTACK_KEY=api_key
VITE_API_BASE=http://localhost:4000