import { Generator } from '../model/Generator';

// DTO - Data Transfer Object
interface IReadGenerateDTO {
  odd?: number;
  repeated?: number;
  frame?: number;
  oddRepeated?: number;
  evenRepeated?: number;
}

class GeneratorRepository {
  private useFilters: Generator[] = [];

  private lastResult: number[] = [];

  private computedPossibilities: number[][] = [];

  constructor() {
    this.useFilters = [];
    this.lastResult = this.getLastResult();
    this.computedPossibilities = this.getAllComputedPossibilities();
  }

  getLastResult(): number[] {
    // Get this result by API
    return [1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 16, 18, 23, 24, 25];
  }

  getAllComputedPossibilities(): number[][] {
    return [
      [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 25, 1, 3], // O: 3 // F: 11 // R: 11
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], // O: 8 // F: 9 // R: 10
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 21, 22, 23, 24], // O: 7 // F: 12 // R: 10
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19], // O: 8  // F: 9 // R: 10
    ];
  }

  generate(): number[] {
    const returnValues = [];

    let {
      odd,
      frame,
      repeated,
    } = this.useFilters[0].filters;

    if (!odd) { odd = 3; }
    if (!frame) { frame = 11; }
    if (!repeated) { repeated = 9; }

    /*
    * The Frame Numbers in Array Index Position:
    * Top: 0, 1, 2, 3, 4 // Equivalent Numbers: 1, 2, 3, 4, 5
    * Left: 5, 10, 15 // Equivalent Numbers: 6, 11, 16
    * Right: 9, 14, 19 // Equivalent Numbers: 10, 15, 20
    * Bottom: 20, 21, 22, 23, 24 // Equivalent Numbers: 21, 22, 23, 24, 25
    */

    // It's not the value on the board, but the value of the indexes in the array
    const frames = [0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24];

    const games = this.computedPossibilities.filter(
      (game) => (
        // Amount of Odds Selected By the User
        (game.filter((number) => (number % 2 !== 0)).length === odd)
        // Amount of choices in the frame
        && (game.filter((number) => frames.indexOf(number - 1) >= 0).length === frame)
        // Amount of repeated from the last oficial game
        && (game.filter((number) => this.lastResult.includes(number)).length === repeated)
      ),
    );

    returnValues.push(games);

    return returnValues;
  }

  list(filters: IReadGenerateDTO): number[] {
    const searchFilters = new Generator();

    Object.assign(searchFilters, {
      filters: {
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
