// @flow

// require

const { validateString, validateNull, maybe, promisify, or } = require("..");

// describe("XXX", () => {
//   test("pp", () => expect(promisify(maybe(validateString))(1)).rejects.toThrow())
// })

// describe

describe("or", () => {
  const validateStringOrNull = or(validateString, validateNull);

  it("allows first validator to pass", () =>
    expect(validateStringOrNull("hello")).toEqual("hello")
  )

  it("allows second validator to pass", () =>
    expect(validateStringOrNull(null)).toEqual(null)
  )

  it("rejects with a message mentioning both", () =>
    expect(validateStringOrNull(1)).toHaveProperty("message", "`1` is not string | null")
  )
})
