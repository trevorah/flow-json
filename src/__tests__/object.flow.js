// @flow

import type { Validator } from "../validator.flow";
const { vString } = require("../primatives");

const vArray = require("../array");
const { ValidationError } = require("../ValidationError");
const vObject = require("../object");
const vMaybe = require("../maybe");

const vStringArray: Validator<Array<string>> = vArray(vString);

const myValidator = vObject({
  cats: vArray(
    vObject({
      id: vString,
      name: vMaybe(vString)
    })
  )
});

(myValidator: Validator<{ cats: Array<{id: string, name: ?string}>}>)
