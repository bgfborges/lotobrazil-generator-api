import { Generator } from '../model/Generator';

// DTO - Data Transfer Object
interface IReadGenerateDTO {
        even?: number;
        odd?: number;
        repeated?: number;
        frame?: number;
        oddRepeated?: number;
        evenRepeated?: number;
}

class GeneratorRepository {
  private useFilters: Generator[] = [];

  constructor() {
    this.useFilters = [];
  }

  generate(): number[] {
    const returnValues = [];

    const existFilters = Object.values(
      this.useFilters[0].filters,
    ).filter((value) => value !== undefined);

    if (existFilters.length > 0) {
      returnValues.push(
        [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
        [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
        [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
      );
    } else {
      returnValues.push(
        [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      );
    }
    return returnValues;
  }

  list(filters: IReadGenerateDTO): number[] {
    const searchFilters = new Generator();

    Object.assign(searchFilters, {
      filters: {
        even: filters.even,
        odd: filters.odd,
        frame: filters.frame,
        repeated: filters.repeated,
        oddRepeated: filters.oddRepeated,
        evenRepeated: filters.evenRepeated,
      },
    });

    this.useFilters.push(searchFilters);

    const returnValues = this.generate();

    return returnValues;
  }
}

export { GeneratorRepository };
