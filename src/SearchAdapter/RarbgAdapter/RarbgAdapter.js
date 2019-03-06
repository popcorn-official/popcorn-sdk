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

  getRequestParams = (token, item, episode = null) => {
    let params = {
      mode    : 'search',
      category: episode ? 'tv' : 'movies',
      sort    : 'seeders',
      ranked  : 1,
      token   : token,
    }

    if (episode) {
      params.search_string = formatShowToSearchQuery(item.title, episode.season, episode.number)

    } else {
      params.search_imdb = item.id
    }

    return params
  }

  getBestTorrents = (existingTorrents, foundTorrents) => {
    let newTorrents = { ...existingTorrents }

    // Then format all the torrents
    foundTorrents.map(torrent => this.formatTorrent(torrent, determineQuality(torrent.download)))
    // Loop true them and get the best ones
      .forEach((newTorrent) => {
        if (getBestTorrentOfTwo(newTorrent, newTorrents[newTorrent.quality])) {
          newTorrents[newTorrent.quality] = newTorrent
        }
      })

    return newTorrents
  }

  /**
   * Search for a episode
   *
   * @param item
   * @param episode
   * @param isRetry
   * @returns {Promise<*>}
   */
  searchEpisode = async(item, episode, isRetry = false) => {
    try {
      const token = await this.getToken()

      if (token) {
        const { data } = await this.rarbgAPI.get('', {
          params: this.getRequestParams(token, item, episode),
        })

        if (data.torrent_results && data.torrent_results.length > 0) {
          const foundTorrents = data.torrent_results
          // First filter out some bad results that did not even match the episode we want
            .filter(
              torrent => torrent.episode_info.imdb === item.id &&
                         parseInt(torrent.episode_info.seasonnum, 10) === episode.season &&
                         parseInt(torrent.episode_info.epnum, 10) === episode.number,
            )


          // Return the best torrents
          return this.getBestTorrents(episode.torrents, foundTorrents)
        }
      }

    } catch (e) {
      if (!isRetry) {
        return this.searchEpisode(item, episode, true)
      }
    }

    return episode.torrents
  }

  /**
   * Search for movies
   *
   * @param item
   * @param isRetry
   * @returns {Promise<*>}
   */
  search = async(item, isRetry = false) => {
    try {
      const token = await this.getToken()

      const { data } = await this.rarbgAPI.get('', {
        params: this.getRequestParams(token, item),
      })

      // Return the best torrents
      return this.getBestTorrents(item.torrents, data)

    } catch (e) {
      if (!isRetry) {
        return this.search(item, true)
      }
    }

    return item.torrents
  }

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
