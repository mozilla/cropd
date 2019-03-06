# cropd - simple image cropper ![npm bundle size](https://img.shields.io/bundlephobia/minzip/cropd.svg)

## Installation

```bash
npm install --save cropd
```

or

```bash
yarn add cropd
```

## Usage

```javascript
import crop from 'cropd';

const cropper = crop(targetElement, {
  src: 'someimageurl'
});

// When you want to extract the cropped region
cropper.toDataURL();
```

## TODO

- wrappers for:
  - Vue
  - React
  - Svelte
- finish Lerna setup
