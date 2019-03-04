/**
 * Compares two torrents and returns the best one
 *
 * @param torrentOne
 * @param torrentTwo
 * @returns {*}
 */
export default (torrentOne, torrentTwo) => {
  if ((!torrentOne || typeof torrentOne === 'undefined') && (!torrentTwo || typeof torrentTwo === 'undefined')) {
    return null
  }

  if (torrentOne && (!torrentTwo || typeof torrentTwo === 'undefined')) {
    return torrentOne

  } else if ((!torrentOne || typeof torrentOne === 'undefined') && torrentTwo) {
    return torrentTwo

  } else if (torrentOne.health.ratio > torrentTwo.health.ratio) {
    return torrentOne
  }

  return torrentTwo
}
