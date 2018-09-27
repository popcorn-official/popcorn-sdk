import SDK from './SDK'
import * as Constants from './constants'

import getHealth from './utils/getHealth'
import getBestTorrent from './utils/getBestTorrent'
import formatRuntime from './utils/formatRuntime'
import formatKbToString from './utils/formatKbToString'

export const utils = {
  getHealth,
  getBestTorrent,
  formatRuntime,
  formatKbToString
}

export {
  SDK,
  Constants
}

export default SDK
