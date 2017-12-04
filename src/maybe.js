// @flow
import type { Validator } from "./validator.flow";

const vOr = require("./or");
const { vVoid, vNull } = require("./primatives");

const vMaybe = <T>(validator: Validator<T>): Validator<?T> =>
  vOr(validator, vOr(vVoid, vNull));

module.exports = vMaybe;
