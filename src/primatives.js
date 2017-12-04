// @flow
import type { Validator } from "./validator.flow";

const { ValidationError } = require("./ValidationError");

const vBoolean: Validator<boolean> = input =>
  typeof input === "boolean" ? input : new ValidationError(input, "boolean");

const vString: Validator<string> = input =>
  typeof input === "string" ? input : new ValidationError(input, "string");

const vNumber: Validator<number> = input =>
  typeof input === "number" ? input : new ValidationError(input, "number");

const vNull: Validator<null> = input =>
  input === null ? input : new ValidationError(input, "null");

const vVoid: Validator<void> = input =>
  input === undefined ? input : new ValidationError(input, "void");

module.exports = {
  vBoolean,
  vString,
  vNumber,
  vNull,
  vVoid
};
