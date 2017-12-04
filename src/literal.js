// @flow

import type { Validator } from "./validator.flow";
const { ValidationError, addPathToStartOfError } = require("./ValidationError");

const vLiteral = (literal: mixed): Validator<*> => input =>
  input === literal
    ? input
    : new ValidationError(input, JSON.stringify(literal));

module.exports = vLiteral;
