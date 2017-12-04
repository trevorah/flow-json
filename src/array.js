// @flow

import type { Validator } from "./validator.flow";
const { ValidationError, addPathToStartOfError } = require("./ValidationError");

const vArray = <T>(validator: Validator<T>): Validator<Array<T>> => input => {
  type ErrorsAndOutputs = {
    errors: Array<ValidationError>,
    outputs: Array<T>
  };

  if (!Array.isArray(input)) return new ValidationError(input, "array");

  const errorsAndOutputs: ErrorsAndOutputs = input
    .map((item, index) => {
      const result = validator(item);
      if (result instanceof ValidationError) {
        return addPathToStartOfError(result, `${index}`);
      } else {
        return result;
      }
    })
    .reduce(
      (acc, result) => {
        const { errors, outputs } = acc;
        if (result instanceof ValidationError) {
          return { errors: errors.concat(result), outputs };
        } else {
          return { errors, outputs: outputs.concat(result) };
        }
      },
      { errors: [], outputs: [] }
    );

  const { errors, outputs } = errorsAndOutputs;

  if (errors.length) {
    return errors[0];
  } else {
    return outputs;
  }
};

module.exports = vArray;
