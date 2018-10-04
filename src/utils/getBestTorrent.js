export default (torrents) => {
  const SD = torrents['480p']
  const HD = torrents['720p']
  const fullHD = torrents['1080p']

  if (!SD && !HD && !fullHD) {
    return null
  }

  let pool = []

  if (fullHD) {
    pool.push(fullHD)
  }

  if (HD) {
    pool.push(HD)
  }

  if (SD) {
    pool.push(SD)
  }

  return pool.reduce((bestTorrent, torrent) => {
    if (bestTorrent === null || torrent.health.ratio > bestTorrent.health.ratio) {
      return torrent
    }

    return bestTorrent
  }, null)
}
