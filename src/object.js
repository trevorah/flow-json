// @flow

import type { Validator } from "./validator.flow";
const { ValidationError, addPathToStartOfError } = require("./ValidationError");

type ValidatorToResult = <T>(_: Validator<T>) => T;

const vObject = <V: { [string]: Validator<any> }>(
  validators: V
): Validator<$ObjMap<V, ValidatorToResult>> => input => {
  if (input === null || typeof input !== "object")
    return new ValidationError(input, "object");

  const inputObject: { [string]: mixed } = input;

  const errorsAndResults = Object.keys(validators).reduce(
    (acc, key) => {
      const { errors, results } = acc;
      const result = validators[key](inputObject[key]);
      if (result instanceof ValidationError) {
        return {
          errors: errors.concat(addPathToStartOfError(result, key)),
          results
        };
      } else {
        return { errors, results: Object.assign(results, { [key]: result }) };
      }
    },
    { errors: [], results: {} }
  );

  const { errors, results } = errorsAndResults;

  if (errors.length) {
    return errors[0];
  } else {
    return results;
  }
};

module.exports = vObject;
