# `babel-plugin-styled-components-selector`

Babel plugin for `styled-components`. This is **not necessary at all to use `styled-components`**, it just adds some nice features to enhance the experience.

## Usage

**THIS ISN'T PUBLISHED YET, WIP**

```
npm install --save-dev babel-plugin-styled-components-selector
```

Then in your babel configuration (probably `.babelrc`):

```JSON
{
  "plugins": ["styled-components-selector"]
}
```

## Features

### Adds CSS component selector support for `styled-components`

The es6 template literal allows you to use the full power of css. But there is no css selector for styled-components.

This babel plugin generates a selector attribute aon all styled-components components which allows you to use them as normal css selector as in the following examples:

```JS
const Button = styled.div`
  color: black;
`;
const Container = styled.div`
  > ${Button.selector} {
    color: green;
  }
`;
```

This works also with composition:

```JS
const Button = styled.div`
  color: black;
`;

const PrimaryButton styled(Button)`
  font-size: 2rem;
`

const Container = styled.div`
  > ${PrimaryButton.selector} {
    color: green;
  }
`;
```

We also inherit the generated selector of the composition hierarchy to nested component:

```JS
const Button = styled.div`
  color: black;
`;

const PrimaryButton styled(Button)`
  font-size: 2rem;
`

const Container = styled.div`
  > ${Button.selector} {
    color: green;
  }
  > ${PrimaryButton.selector} {
    color: red;
  }
`;
```

## Credits & Inspiration

[styled-components](https://styled-components.com/) for bringing css and components closer together in a sane way

[babel-plugin-styled-components](https://github.com/styled-components/babel-plugin-styled-components) took parts of your code and adjusted them to my needs

[murmurhash-js](http://github.com/garycourt/murmurhash-js) copied your hashing function


## License

Licensed under the MIT License, Copyright © 2016 Jan Zimmek.

See [LICENSE.md](./LICENSE.md) for more information.
