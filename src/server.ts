import express from 'express';
import { generatorRoutes } from './routes/generator.routes';

const app = express();

app.use(express.json());

app.use('/generator', generatorRoutes);

app.get('/', (request, response) => response.status(200).json({ status: 'OK Running' }));

app.listen(4000, () => console.log('Running on folder 4000'));
