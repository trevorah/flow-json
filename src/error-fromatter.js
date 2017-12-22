// @flow


// edge cases:
// 1. input doesnt match output
// 2.

const dirtyInput1 = {
  bird: "hello",
  dog: "woof",
  cat: "two",
  lamps: {
    cat: "yo",
    dog: 3
  },
  fishes: [
    "1"
  ]
}

const outputWithErrors1 = {
  bird: "hello",
  cat: new Error("number"),
  lamps: {
    cat: "yo",
    dog: 3
  },
  fishes: [
    new Error("{ fish: { dog: number }}")
  ]
}

const outputSymbol = Symbol("output");
const errorSymbol = Symbol("error");

type Merged = {|
  key?: string,
  output?: mixed,
  error?: Error,
  children: Array<Merged>
|}

type Merged2 = {|
  key?: string,
  __output?: mixed,
  __error?: Error
|} | Array<Merged2> | {[string]: Merged2}

type Printable = string | Array<Printable> | {[string]: Printable }

const makePrintable = (result: mixed): Printable => {
  if (Array.isArray(result)) {
    return result.reduce((acc, item) => acc.concat(makePrintable(item)), [])
  } else if (typeof result === "object" && result !== null) {
    return Object.entries(result).reduce((acc, [key, value]) => Object.assign(acc, {[key]: makePrintable(value)}), {})
  } else {
    if (result instanceof Error) {
      return `${escapeBefore}${JSON.stringify(result.message)} <- expected ${result.message}${escapeAfter}`
    } else {
      return JSON
    }
  }
}

const escapeBefore = "$$BEFORE$$"
const escapeAfter = "$$AFTER$$"

// const makeStringPrintable = (result: mixed): Printable => {
//   if (result instanceof Error) {
//     return `'${input}' <- expected ${result.message}`;
//   } else
// }

const printableToString = (printable: Printable): string =>
  JSON.stringify(printable, null, 2).replace(/"/g, "")

const p: Printable = {
  bird: "$$BEFORE$$\"hello\"$$AFTER$$",
  dog: "$$BEFORE$$(ignored)$$AFTER$$",
  cat: "$$BEFORE$$\"two\" <- expected number$$AFTER$$",
  lamps: {
    cat: "$$BEFORE$$\"yo\"$$AFTER$$",
    dog: "3"
  },
  fishes: [
    "$$BEFORE$$\"1\" <- expected { fish: { dog: number }}$$AFTER$$"
  ]
}

// console.log(JSON.stringify(o, null, 2).replace(/\\"/g, "\"").replace(/"\$\$BEFORE\$\$/g, "").replace(/\$\$AFTER\$\$"/g, ""))

// const merged1: Merged2 = {
//   // bird: { __output: "hello" },
//   cat: { __output: undefined, __error: new Error("number")},
//   // lamps: {
//   //   cat: { __output: undefined },
//   // }
// }

// const merge = (dirtyInput, outputWithErrors) => {
//   if (typeof dirtyInput === "object") {
//     dirtyInput.
//   }
// }
//
// const formatter = (dirtyInput, outputWithErrors): string => {
//   const x = {}
//
//   return JSON.stringify(value, (key, value) => {
//     if (this.)
//
//   }, 2)
//
// }

const result = `{
  bird: "hello"
  dog: (ignored)
  cat: "two" <- expected number
  lamps: {
    cat: "yo",
    dog: 3
  },
  fishes: [
    "1" <- expected { fish: { dog: number }}
  ]
}`
