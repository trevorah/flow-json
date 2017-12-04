// @flow

class ValidationError extends Error {

  expectedTypes: Array<string>
  path: Array<string>


  constructor(input: mixed, expectedType: string | Array<string>, path: Array<string> = []) {
    const expectedTypes = [].concat(expectedType);
    const pathExplainer = path.length ? ` (at ${path.join(".")})` : ""

    super(`\`${JSON.stringify(input)}\` is not ${expectedTypes.join(" | ")}${pathExplainer}`)

    this.expectedTypes = expectedTypes;
    this.path = path;
  }
}



// XXX is not 111
// XXX is not 111 or 222
// XXX is not 111, 222, or 333


// `"face"` is not string
// `"face"` is not object | null
// `"face"` is not an object, a string, or null

// `"face"` is not an object, a string, or null (at car.wheels[2].hub)

// at ([2)
// at (wheels.2)
// at (car.wheels[2])
// at (dog.car.wheels[2])

// at ([2][3])




type ThrowableValidator<T> = (input: mixed) => T
type PromisedValidator<T> = (input: mixed) => Promise<T>


type JoiCallback<T> = (error: ValidationError | null, value: T | null) => void
type JoiValidator<T> = (input: mixed, cb?: JoiCallback<T>) => { error: ValidationError | null, value: T | null }


const throwify = <T>(validator: Validator<T>): ThrowableValidator<T> =>
  input => {
    const result = validator(input);
    if (result instanceof ValidationError) {
      throw result;
    } else {
      return result;
    }
  }

const promisify = <T>(validator: Validator<T>): PromisedValidator<T> =>
  input => {
    const result = validator(input);
    if (result instanceof ValidationError) {
      return Promise.reject(result)
    } else {
      return Promise.resolve(result);
    }
  }

// const joiify = <T>(validator: Validator<T>): JoiValidator<T> =>
//   input => {
//     const result = validator(input);
//     if (result instanceof ValidationError) {
//
//     }
//   }


const combineErrors = (input: mixed, errorA: ValidationError, errorB: ValidationError): ValidationError =>
  new ValidationError(input, errorA.expectedTypes.concat(errorB.expectedTypes));

// const addToError = (error: ValidationError, context: string)

type Validator<T> = (value: mixed) => T | ValidationError;

const validateString: Validator<string> = value =>
  typeof value === 'string' ? value : new ValidationError(value, ["string"])

const validateNull: Validator<null> = input => input === null ? input : new ValidationError(input, ["null"]);

const validateUndefined: Validator<void> = input => input === undefined ? input : new ValidationError(input, ["undefined"])

const maybe = <T>(validator: Validator<T>): Validator<?T> =>
  or(validator, or(validateNull, validateUndefined))

const or = <A, B>(validateA: Validator<A>, validateB: Validator<B>): Validator<A | B> =>
  input => {
    const resultA = validateA(input);

    if (resultA instanceof ValidationError) {
      const resultB = validateB(input);
      if (resultB instanceof ValidationError) {
        return combineErrors(input, resultA, resultB)
      } else {
        return resultB;
      }
    } else {
      return resultA
    }
  }

type SchemaToResult = <T>(_: Validator<T>) => T

// $ObjMap<O, <V>(_: Parser<V>) => V>

const schema = <S: { [string]: Validator<any> }>(validationSchema: S): Validator<$ObjMap<S, SchemaToResult>> =>
  input => {
    return new ValidationError(input, ["eggs"]);
  }


const x = schema({ cat: validateString, dog: validateNull })

// const validateNiceThing = schema({
//   videos: vArray(vObject({
//     id: vString,
//     name: vString,
//     poster: vMaybe(vString),
//     custom_values : vObject({
//       matchday: vMaybe(vString)
//     })
//   }))
// })

const y = x("face")

module.exports = {
  validateString,
  validateNull,
  or,
  maybe,
  promisify
}
