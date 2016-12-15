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

You can work around this problem, but you will either:

- break component encapsulation by using html tag/class selectors in the parent component
- or have to introduce a bunch of intermediate styled-components, even for minimal adjustments like setting a margin

This babel plugin generates a selector attribute on all styled-components components. This allows you to use them as normal css selectors as in the following examples without breaking encapsulation:

```JS
const Button = styled.button`
  color: black;
`;
const Container = styled.div`
  > ${Button.selector} {
    color: green;
  }
`;
```

Works also with composition:

```JS
const Button = styled.button`
  color: black;
`;

const PrimaryButton = styled(Button)`
  font-size: 2rem;
`;

const Container = styled.div`
  > ${PrimaryButton.selector} {
    color: green;
  }
`;
```

Also inherit the generated selector of the composition hierarchy to nested components:

```JS
const Button = styled.button`
  color: black;
`;

const PrimaryButton = styled(Button)`
  font-size: 2rem;
`;

const Container = styled.div`
  > ${Button.selector} {
    color: green;
  }
  > ${PrimaryButton.selector} {
    color: red;
  }
`;
```

Component selectors can be nested in css:

```JS
const Icon = styled.img`
  max-width: 100%;
  height: auto;
  display: block;  
`

const IconButton = styled.div`
  padding: 1rem;
`;

const Container = styled.div`
  > ${IconButton.selector} {
    color: green;
    > ${Icon.selector} {
      border: 2px;
    }
  }
`;
```

## Credits & Inspiration

[styled-components](https://styled-components.com/) for bringing css and react components closer together in a sane way

[babel-plugin-styled-components](https://github.com/styled-components/babel-plugin-styled-components) took parts of your code and adjusted them to my needs

[murmurhash-js](http://github.com/garycourt/murmurhash-js) copied your hashing function


## License

Licensed under the MIT License, Copyright © 2016 Jan Zimmek.

See [LICENSE.md](./LICENSE.md) for more information.
