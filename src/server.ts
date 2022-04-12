import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (request, response) => response.status(200).json({ status: 'OK Running' }));

app.listen(4000, () => console.log('Running on folder 4000'));
