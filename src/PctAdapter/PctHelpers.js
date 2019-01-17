import getHealth from '../utils/getHealth'

export const formatTorrents = (torrents) => {
  const formatTorrent = (torrent) => ({
    ...torrent,
    health: getHealth(torrent.seeds, torrent.peers),
  })

  return torrents.map(formatTorrent)
}

export const formatRating = rating => ({
  stars: (rating.percentage / 100) * 5,
  ...rating,
})
