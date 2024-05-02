- **Generate Type Command**: This extension adds a command to VSCode to generate typings from selected variables in the code editor.

## Looks like

### Variable selection

![Variable selection image](https://i.ibb.co/pxLMVJV/image.png)

### Typing generation

![Typing generation image](https://i.ibb.co/qWT2sBS/image-1.png)

## Usage

To use the typing generation feature, follow these steps:

1. Select the variable you want to type in the code editor.
2. Click on the right mouse button to open the context menu.
3. Select the Var to type menu.
4. The typing will be generated and show in a textDocument editor. So if you want to save it, you can do it manually.

## Settings

This extension provides the following settings:

- **useTypeAlias**: Defines whether to use type aliases (`type`) or interfaces (`interface`) for typings. Default is `true`.
- **rootName**: Defines the root name to be used for the generated typings. Default is an empty string.

to edit these settings, go to `File > Preferences > Settings` and search for `vscode-extensions`. Or edit the `settings.json` file directly by adding the following configuration:

```json
{
  "varToType.configs": {
    "useTypeAlias": true, // or false -> type or interface || default is true
    "rootName": "MyRootName" // use variable name as default
  }
}
```

## Example Usage

```typescript
const foo = {
  bar: 12,
  baz: "hello",
};

// After selecting the 'foo' variable and executing the var to type command:
// The following typing will be generated:

type Foo = {
  bar: number;
  baz: string;
};

// Or if you have the useTypeAlias setting set to false:

interface Foo {
  bar: number;
  baz: string;
}

// Or if you have the rootName setting set to 'MyRootName':

type MyRootName = {
  bar: number;
  baz: string;
};

// Anothers array example

const arr = [
  { name: "John", age: 30 },
  { name: "Jane", age: 25 },
];

// After selecting the 'arr' variable and executing the var to type command:

type Arr = {
  name: string;
  age: number;
}[];
```

**important**: If you are using interfaces the extension will not generate the array type, you need to add it manually. Interfaces are objects oriented and do not support arrays in the root.
