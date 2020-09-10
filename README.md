[![npm version][npm-image]][npm-url]
[![downloads][downloads-image]][npm-url]
[![build status][build-image]][build-url]
[![coverage status][coverage-image]][coverage-url]
[![Language grade: JavaScript][lgtm-image]][lgtm-url]
[![size][bundlephobia-image]][bundlephobia-url]


# instead

`instead` is a *deep-replace* function which is value-wise equivalent to the expression `a = b` but expressed as `a = instead( a, b )`. However, unike pure assignment, or `Object.assign()` or any of the *deep-assign* packages, `instead` replaces values, object properties and array items with the new value, only if they differ.

If `a` and `b` serializes to the exact same, `(a = b) === b`, but `instead(a, b) === a`.

This is sometimes extremely handy when referencial equality matters, especially when equality can optimize away unnecessary logic, such as in React.

Example:
```ts
const previousValue = {
    foo: { b: 1 },
    bar: { c: 2 },
};
const incomingValue = {
    foo: { b: 1 },
    bar: { c: 3 },
};
const newValue = instead( previousValue, incomingValue );
// Incoming {.foo} is equivalent to previous {.foo}, so reference is kept:
( newValue.foo === previousValue.foo ); // true
( newValue.bar === incomingValue.bar ); // true
```

# Usage

`npm i instead`, `yarn add instead` or similar.

`instead` is default exported and exported as a property `instead`, so:

```ts
import instead from 'instead'
// same as
const { instead } = require( 'instead' );
```


[npm-image]: https://img.shields.io/npm/v/instead.svg
[npm-url]: https://npmjs.org/package/instead
[downloads-image]: https://img.shields.io/npm/dm/instead.svg
[build-image]: https://img.shields.io/github/workflow/status/grantila/instead/Master.svg
[build-url]: https://github.com/grantila/instead/actions?query=workflow%3AMaster
[coverage-image]: https://coveralls.io/repos/github/grantila/instead/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/grantila/instead?branch=master
[lgtm-image]: https://img.shields.io/lgtm/grade/javascript/g/grantila/instead.svg?logo=lgtm&logoWidth=18
[lgtm-url]: https://lgtm.com/projects/g/grantila/instead/context:javascript
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/instead
[bundlephobia-url]: https://bundlephobia.com/result?p=instead
