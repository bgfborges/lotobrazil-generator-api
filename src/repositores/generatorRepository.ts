import axios from 'axios';
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

  private computedPossibilities: number[][] = [];

  constructor() {
    this.useFilters = [];
    this.computedPossibilities = this.getAllComputedPossibilities();
  }

  async getLastResult(): Promise<any> {
    // Get this result by API
    try {
      const { data } = await axios.get('https://loteriascaixa-api.herokuapp.com/api/lotofacil/latest');
      const game = data.dezenas.map((number: string) => Number(number));
      return game;
    } catch (err) {
      return 'unavailable';
    }
  }

  generateNewGame(amount: number, min: number, max: number): number[][] {
    const allGames = [];
    let probabilities = [];

    for (let game = 0; game < amount;) {
      for (let i = 0; i < 15;) {
        const num = Math.floor(Math.random() * (max - min + 1) + min);
        const exist = probabilities.find((item) => item === num);

        if (!exist) {
          probabilities.push(num);
          i += 1;
        }
      }

      probabilities.sort((a, b) => a - b);

      allGames.push(probabilities);

      probabilities = [];

      game += 1;
    }

    return allGames;
  }

  // Computed Possibilities for the Next Lottery
  getAllComputedPossibilities(): number[][] {
    const probabilities = this.generateNewGame(2000, 1, 25);

    return probabilities;
  }

  async generate(): Promise<number[] | string> {
    const returnValues = [];

    let {
      odd,
      frame,
      repeated,
    } = this.useFilters[0].filters;

    if (!odd) { odd = 7; }
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

    // Retrieve last Result
    const lastResult = await this.getLastResult();

    if (lastResult === 'unavailable') {
      return lastResult;
    }

    const games = this.computedPossibilities.filter(
      (game) => (
        // Amount of Odds Selected By the User
        (game.filter((number) => (number % 2 !== 0)).length === odd)
        // Amount of choices in the frame
        && (game.filter((number) => frames.indexOf(number - 1) >= 0).length === frame)
        // Amount of repeated from the last oficial game
        && (game.filter((number) => lastResult.includes(number)).length === repeated)
      ),
    );

    returnValues.push(games);

    return returnValues;
  }

  async list(filters: IReadGenerateDTO): Promise<number[] | string> {
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

    const returnValues = await this.generate();

    return returnValues;
  }
}

export { GeneratorRepository };
