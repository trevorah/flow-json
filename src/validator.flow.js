// @flow

import { ValidationError } from "./ValidationError";

export type Validator<T> = (input: mixed) => T | ValidationError;
