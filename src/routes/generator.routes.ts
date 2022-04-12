import { Router } from 'express';
import { GeneratorRepository } from '../repositores/generatorRepository';

const generatorRoutes = Router();

// Resource "Generator" (as the requirment of defining resources by the API REST)

generatorRoutes.get('/', (req, res) => {
  const { filters } = req.body;

  const generatorRepository = new GeneratorRepository();

  const returnValues = generatorRepository.list(filters);

  return res.status(201).json({ numbers: [{ returnValues }] });
});

export { generatorRoutes };
