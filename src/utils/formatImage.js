export default ({ poster, backdrop } = {}) => {
  const replaceWidthPart = (uri, replaceWith) => uri.replace('w500', replaceWith)

  return {
    poster: {
      full  : !poster ? null : replaceWidthPart(poster, 'original'),
      high  : !poster ? null : replaceWidthPart(poster, 'w1280'),
      medium: !poster ? null : replaceWidthPart(poster, 'w780'),
      thumb : !poster ? null : replaceWidthPart(poster, 'w342'),
    },
    backdrop: {
      full  : !backdrop ? null : replaceWidthPart(backdrop, 'original'),
      high  : !backdrop ? null : replaceWidthPart(backdrop, 'w1280'),
      medium: !backdrop ? null : replaceWidthPart(backdrop, 'w780'),
      thumb : !backdrop ? null : replaceWidthPart(backdrop, 'w342'),
    },
  }

}
