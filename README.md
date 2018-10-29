# Popcorn SDK
![https://img.shields.io/npm/v/popcorn-sdk.svg](https://img.shields.io/npm/v/popcorn-sdk.svg?style=flat-square) [![npm downloads](https://img.shields.io/npm/dt/popcorn-sdk.svg?maxAge=2592000&style=flat-square)](https://npm-stat.com/charts.html?package=popcorn-sdk) [![](https://img.shields.io/github/issues-raw/tripss/popcorn-sdk.svg?style=flat-square)](https://github.com/tripss/popcorn-sdk/issues) [![](https://img.shields.io/david/tripss/popcorn-sdk.svg?style=flat-square)](https://david-dm.org/tripss/popcorn-sdk#info=dependencies)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/tripss/popcorn-sdk.svg)](http://isitmaintained.com/project/tripss/popcorn-sdk "Average time to resolve an issue") [![Percentage of issues still open](http://isitmaintained.com/badge/open/tripss/popcorn-sdk.svg)](http://isitmaintained.com/project/tripss/popcorn-sdk "Percentage of issues still open")[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/pct-org/Lobby)


> SDK for Popcorn Time applications making it easier to retrieve movies / shows with meta data

### Installation
```shell
$ npm install --save popcorn-sdk
```

## Examples
```js
import SDK from 'popcorn-sdk'

const movies = await SDK.getMovies()
const movie = await SDK.getMovie(imdbId)

const shows = await SDK.getShows()
const show = await SDK.getShow(imdbId)

// Or for slower internet connections you can partial load a show
const showBasic = await SDK.getBasicShow(imdbId)
// getShowMeta retrieves data from The Movie DB for better episode info and season / episode images
const showWithMeta = await SDK.getShowMeta(showBasic)
```

### Movie output
```JSON
// TODO
```

### Show output
```JSON
// TODO
```

## [License](https://github.com/tripss/popcorn-native/blob/master/LICENSE)

This project is [MIT licensed](./LICENSE).

## Collaboration

If you have questions or [issues](https://github.com/TriPSs/popcorn-sdk/issues), please [open an issue](https://github.com/TriPSs/popcorn-sdk/issues/new)!
