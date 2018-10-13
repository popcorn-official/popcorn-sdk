export default ({ poster, fanart } = {}) => {
  const replaceWidthPart = (uri, replaceWith) => uri.replace('w500', replaceWith)

  return {
    poster: {
      full  : !poster ? null : replaceWidthPart(poster, 'original'),
      high  : !poster ? null : replaceWidthPart(poster, 'w1280'),
      medium: !poster ? null : replaceWidthPart(poster, 'w780'),
      thumb : !poster ? null : replaceWidthPart(poster, 'w342'),
    },
    fanart: {
      full  : !fanart ? null : replaceWidthPart(fanart, 'original'),
      high  : !fanart ? null : replaceWidthPart(fanart, 'w1280'),
      medium: !fanart ? null : replaceWidthPart(fanart, 'w780'),
      thumb : !fanart ? null : replaceWidthPart(fanart, 'w342'),
    },
  }

}
