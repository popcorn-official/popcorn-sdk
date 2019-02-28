import Xmlrpc from 'react-native-xmlrpc'
import Deserializer from 'react-native-xmlrpc/lib/Deserializer'

export default class SubsAdapter {

  client = null

  token = null

  userAgent = 'Popcorn Time'

  constructor() {
    this.client = new Xmlrpc('https://api.opensubtitles.org/xml-rpc')

    this.login().then(({ token }) => this.token = token)
  }

  call = (method, args) => new Promise((resolve, reject) => {
    this.client.call(method, [...args], (error, response) => {
      if (error) {
        throw error
      }

      const deserializer = new Deserializer

      deserializer.deserializeMethodResponse(response, (error, response) => {
        if (error) {
          throw error
        }

        resolve(response)
      })
    })
  })

  login = () => this.call('LogIn', ['', '', 'en', this.userAgent])

  searchSubtitles(item, season = null, episode = null) {
    const query = {
      imdbid: item.id.replace('tt', ''),
    }

    return this.call('SearchSubtitles', [
      this.token,
      this.optimizeQueryTerms(item, season, episode),
    ]).then(({ data }) => this.optimizeSubs(data, query))
      .then(list => this.filter(list, query))
  }


  /**
   * TODO:: EVERYTHING BELOW SHOULD BE IMPROVED AND CLEANEDUP
   */

  // AND USE THIS
  optimizeQueryTerms(item, season = null, episode = null) {
    const imdbId = parseInt(item.id.toString().replace('tt', ''), 10)

    const output = []
    let i = 0

    if (imdbId) { // third data call
      output[i] = {}
      output[i].imdbid = imdbId.toString()

      if (season && episode) {
        output[i].season = season.toString()
        output[i].episode = episode.toString()
      }
    }

    // mandatory lang parameter
    for (let o of output) {
      o.sublanguageid = 'all'
    }

    return output
  }

  optimizeSubs(response, input) {
    // based on OpenSRTJS, under MIT - Copyright (c) 2014 Eóin Martin
    let inputTags
    let inputTagsDic = Object()
    const normalize = this.normalizeProt()
    const matchTags = (sub, maxScore) => {
      if (!input.filename) return 0

      if (!inputTags)
        inputTags = input.filename && normalize(input.filename).toLowerCase().match(/[a-z0-9]{2,}/gi)

      if (!inputTags || inputTags.length <= 2) return 0

      const subNames = normalize(sub.MovieReleaseName + '_' + sub.SubFileName)
      const subTags = subNames.toLowerCase().match(/[a-z0-9]{2,}/gi)

      if (!subTags.length) return 0

      for (let tag of inputTags) inputTagsDic[tag] = false

      let matches = 0
      for (let subTag of subTags) { // is term in filename, only once
        if (inputTagsDic[subTag] == false) {
          inputTagsDic[subTag] = true
          matches++
        }
      }

      return parseInt((matches / inputTags.length) * maxScore)
    }
    const subtitles = Object()

    // if string passed as supported extension, convert to array
    if (input.extensions && typeof input.extensions === 'string') input.extensions = [input.extensions]

    // if no supported extensions passed, default to 'srt'
    if (!input.extensions || !input.extensions instanceof Array) input.extensions = ['srt']

    // remove duplicate and empty
    var seen = {}
    response = response.filter(sub => {
      return sub && seen.hasOwnProperty(sub.IDSubtitle) ? false : (seen[sub.IDSubtitle] = true)
    })

    return Promise.all(response.map(sub => {
      // parse
      sub.imdbid = (sub.SeriesIMDBParent && sub.SeriesIMDBParent !== '0')
        ? parseInt(sub.SeriesIMDBParent, 10)
        : sub.IDMovieImdb && parseInt(sub.IDMovieImdb, 10)
      sub.season = sub.SeriesSeason && parseInt(sub.SeriesSeason)
      sub.episode = sub.SeriesEpisode && parseInt(sub.SeriesEpisode)
      sub.filesize = parseInt(sub.MovieByteSize)
      sub.hash = sub.MovieHash != '0' && sub.MovieHash.toLowerCase()
      sub.fps = sub.MovieFPS && parseInt(sub.MovieFPS) > 0 && sub.MovieFPS.toString()

      // check: extension, imdb, episode
      if ((input.extensions.indexOf(sub.SubFormat) == -1)
          || (input.imdbid && input.imdbid != sub.imdbid)
          || (input.season && input.episode && (input.season != sub.season || input.episode != sub.episode))) return

      const tmp = {
        langcode : sub.ISO639,
        downloads: parseInt(sub.SubDownloadsCnt),
        lang     : sub.LanguageName,
        encoding : sub.SubEncoding,
        id       : sub.IDSubtitleFile,
        filename : sub.SubFileName,
        date     : sub.SubAddDate,
        score    : 0,
        fps      : parseFloat(sub.MovieFPS) || null,
        format   : sub.SubFormat,
        url      : input.gzip
          ? sub.SubDownloadLink
          : sub.SubDownloadLink.replace('.gz', ''),
        utf8     : input.gzip
          ? sub.SubDownloadLink.replace('download/', 'download/subencoding-utf8/')
          : sub.SubDownloadLink.replace('.gz', '').replace('download/', 'download/subencoding-utf8/'),
        vtt      : sub.SubDownloadLink.replace('download/', 'download/subformat-vtt/').replace('.gz', ''),
      }

      // version
      if (input.hash && sub.hash == input.hash || input.filesize && input.filesize == sub.filesize) {
        tmp.score += 9
      } else {
        tmp.score += matchTags(sub, 7)
        if ((input.fps && sub.fps) && (sub.fps.startsWith(input.fps) || input.fps.startsWith(sub.fps)))
          (tmp.score += 1)
      }

      // rank
      sub.UserRank.match(/trusted|administrator/) && (tmp.score += 0.5)
      sub.UserRank.match(/platinum member|gold member/) && (tmp.score += 0.2)

      // store subs for sorting
      if (!subtitles[tmp.langcode]) {
        subtitles[tmp.langcode] = [tmp]
      } else {
        subtitles[tmp.langcode][Object.keys(subtitles[tmp.langcode]).length] = tmp
      }

      return
    })).then(() => subtitles)
  }

  filter(list = Object(), input) {
    const subtitles = Object()

    if (!input.limit || (isNaN(input.limit) && ['best', 'all'].indexOf(input.limit.toLowerCase()) == -1)) {
      input.limit = 'best'
    }

    for (let i in list) {
      let lang = list[i]
      let langcode = lang[0].langcode

      // sort by score, sub-sort by downloads
      lang = lang.sort((a, b) => {
        if (a.score === b.score) {
          let x = a.downloads
          let y = b.downloads
          return y < x ? -1 : y > x ? 1 : 0
        }
        return b.score - a.score
      })

      // filter
      switch (input.limit.toString().toLowerCase()) {
        case 'best':
          // keep only the first (best) item
          subtitles[langcode] = lang[0]
          break
        case 'all':
          // all good already
          subtitles[langcode] = lang
          break
        default:
          // keep only n = input.limit items
          subtitles[langcode] = lang.slice(0, parseInt(input.limit))
      }
    }

    return Promise.resolve(subtitles)
  }

  normalizeProt() {
    const from = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç'
    const to = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc'
    const mapping = Object()

    for (let i = 0, j = from.length; i < j; i++) {
      mapping[from.charAt(i)] = to.charAt(i)
    }

    return str => {
      const ret = Array()
      for (let i = 0, j = str.length; i < j; i++) {
        let c = str.charAt(i)
        ret.push(mapping[c] || c)
      }
      return ret.join('')
    }
  }
}
