const PLURAL_CASES: number[] = [2, 0, 1, 1, 1, 2];

export const getPluralIndex = (number: number): number =>
  number % 100 > 4 && number % 100 < 20
    ? 2
    : PLURAL_CASES[number % 10 < 5 ? number % 10 : 5];
