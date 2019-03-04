import axios from 'axios'

import * as rbg from './RargbTorrentSearcher'
import formatShowToSearchQuery from '../../utils/formatShowToSearchQuery'
import getHealth from '../../utils/getHealth'
import determineQuality from '../../utils/determineQuality'
import getBestTorrent from '../../utils/getBestTorrent'
import getBestTorrentOfTwo from '../../utils/getBestTorrentOfTwo'

export default class RarbgAdapter {

  static providerName = 'rbg'

  rarbgAPI = axios.create({
    baseURL: 'https://torrentapi.org/pubapi_v2.php',
    params : {
      app_id: 'popsticle',
      format: 'json_extended',
    },
  })

  token = null
  tokenExpires = null

  getToken = () => new Promise((resolve, reject) => {
    if (this.token !== null && (this.tokenExpires - Date.now() > 0)) {
      resolve(this.token)

    } else {
      const ttl = Date.now() + 900000

      this.rarbgAPI.get('', { params: { get_token: 'get_token' } }).then(({ data }) => {
        this.token = data.token
        this.tokenExpires = ttl

        // There is a 1 req / 2 sec limit
        setTimeout(() => {
          resolve(this.token)
        }, 2000)

      }).catch(reject)
    }
  })

  searchEpisode = async(item, episode, isRetry = false) => {
    const newTorrents = episode.torrents

    try {
      const token = await this.getToken()

      if (token) {
        const { data } = await this.rarbgAPI.get('', {
          params: {
            search_string: formatShowToSearchQuery(item.title, episode.season, episode.number),
            mode         : 'search',
            category     : '18;41',
            sort         : 'seeders',
            ranked       : 1,
            token        : token,
          },
        })

        if (data.torrent_results && data.torrent_results.length > 0) {
          data.torrent_results
          // First filter out some bad results that did not even match the episode we want
            .filter(
              torrent => torrent.episode_info.imdb === item.id &&
                         parseInt(torrent.episode_info.seasonnum, 10) === episode.season &&
                         parseInt(torrent.episode_info.epnum, 10) === episode.number,
            )
            // Then format all the torrents
            .map(torrent => this.formatTorrent(torrent, determineQuality(torrent.download)))
            // Loop true them and get the best ones
            .forEach((newTorrent) => {
              if (getBestTorrentOfTwo(newTorrent, newTorrents[newTorrent.quality])) {
                newTorrents[newTorrent.quality] = newTorrent
              }
            })

        }
      }

    } catch (e) {
      if (!isRetry) {
        return this.searchEpisode(item, episode, true)
      }
    }

    return newTorrents
  }

  search = (query, category, retry = false) => new Promise((resolve) => {
    rbg.search('popsticle', {
      query,
      category,
      sort    : 'seeders',
      verified: false,
    }).then(results => results.map(torrent => this.formatTorrent(torrent)))
      .catch((error) => {
        if (!retry) {
          return resolve(this.search(query, category, true))
        }

        return resolve([])
      })
  })

  formatTorrent = (torrent, quality) => ({
    url     : torrent.download,
    seeds   : torrent.seeders,
    peers   : torrent.leechers,
    size    : torrent.size,
    filesize: torrent.size,
    provider: RarbgAdapter.providerName,
    health  : getHealth(torrent.seeders, torrent.leechers),
    filename: torrent.title,
    quality,
  })
}
