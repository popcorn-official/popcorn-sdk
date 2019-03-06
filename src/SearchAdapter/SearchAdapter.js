import RarbgAdapter from './RarbgAdapter'

export default class SearchAdapter {

  constructor() {
    this.provider = new RarbgAdapter
  }

  searchEpisode = (item, episode) => this.provider.searchEpisode(item, episode)

  search = item => this.provider.search(item)

  /**
   * This does not work yet but when we add more providers it is the way whe will go
   */
  // providers = [
  //   new RarbgAdapter(),
  // ]
  //
  // searchEpisode = (item, episode) => Promise.all(
  //   this.providers.map(provider => provider.searchEpisode(item, episode)),
  // )
  //
  // search = search => Promise.all(
  //   this.providers.map(provider => provider.search(search)),
  // )

}
