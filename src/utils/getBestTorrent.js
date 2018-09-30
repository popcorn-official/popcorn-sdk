export default (torrents) => {
  const SD = torrents['480p']
  const HD = torrents['720p']
  const fullHD = torrents['1080p']

  if (!SD && !HD && !fullHD) {
    return null
  }

  let pool = []

  if (SD) {
    pool.push(SD)
  }

  if (HD) {
    pool.push(HD)
  }

  if (fullHD) {
    pool.push(fullHD)
  }

  return pool.reduce((bestTorrent, torrent) => {
    if (bestTorrent === null || torrent.health.ratio > bestTorrent.health.ratio) {
      return torrent
    }

    return bestTorrent
  }, null)
}
