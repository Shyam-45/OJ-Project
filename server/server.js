import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import routes from './routes/routes.js';
import DBConnection from './database/db.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

DBConnection();

app.use('/', routes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}!`)
})
