export default (seeds, peers) => {
  const ratio = seeds && !!peers ? seeds / peers : seeds

  // Normalize the data. Convert each to a percentage
  // Ratio: Anything above a ratio of 5 is good
  const normalizedRatio = Math.min((ratio / 5) * 100, 100)
  // Seeds: Anything above 30 seeds is good
  const normalizedSeeds = Math.min((seeds / 30) * 100, 100)

  // Weight the above metrics differently
  // Ratio is weighted 60% whilst seeders is 40%
  const weightedRatio = normalizedRatio * 0.6
  const weightedSeeds = normalizedSeeds * 0.4
  const weightedTotal = weightedRatio + weightedSeeds

  // Scale from [0, 100] to [0, 3]. Drops the decimal places
  const scaledTotal = ((weightedTotal * 3) / 100) || 0

  if (scaledTotal === 1) {
    return {
      text  : 'decent',
      color : '#FF9800',
      number: 1,
      ratio,
    }

  } else if (scaledTotal >= 2) {
    return {
      text  : 'healthy',
      color : '#4CAF50',
      number: 2,
      ratio,
    }
  }

  return {
    text  : 'poor',
    color : '#F44336',
    number: 0,
    ratio,
  }
}
