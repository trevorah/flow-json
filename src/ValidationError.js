// @flow

class ValidationError extends Error {
  input: mixed;
  expectedTypes: Array<string>;
  path: Array<string>;

  constructor(
    input: mixed,
    expectedType: string | Array<string>,
    path: Array<string> = []
  ) {
    const expectedTypes = [].concat(expectedType);
    const pathExplainer = path.length ? ` (at ${path.join(".")})` : "";

    super(
      `\`${JSON.stringify(input)}\` is not ${expectedTypes.join(" | ")}${
        pathExplainer
      }`
    );

    this.input = input;
    this.expectedTypes = expectedTypes;
    this.path = path;
  }
}

const addPathToStartOfError = (
  error: ValidationError,
  path: string
): ValidationError =>
  new ValidationError(
    error.input,
    error.expectedTypes,
    [path].concat(error.path)
  );

const combineErrors = (
  errorA: ValidationError,
  errorB: ValidationError
): ValidationError =>
  new ValidationError(
    errorA.input,
    errorA.expectedTypes.concat(errorB.expectedTypes),
    errorA.path
  );

module.exports = {
  ValidationError,
  addPathToStartOfError,
  combineErrors
};
