// @flow

import type { Validator } from "./validator.flow";
const { ValidationError, combineErrors } = require("./ValidationError");

// const vUnion = <>

const vOr = <A, B>(
  validatorA: Validator<A>,
  validatorB: Validator<B>
): Validator<A | B> => input => {
  const resultA = validatorA(input);

  if (resultA instanceof ValidationError) {
    const resultB = validatorB(input);
    if (resultB instanceof ValidationError) {
      return combineErrors(resultA, resultB);
    } else {
      return resultB;
    }
  } else {
    return resultA;
  }
};

module.exports = vOr;
