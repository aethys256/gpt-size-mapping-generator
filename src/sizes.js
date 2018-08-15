export default [
  {
    ads: [
      // Adsense (best to worst)
      '300x250',
      '336x280',
      '728x90',
      '320x100',
      '320x50',
      '468x60',
      '234x60',
      // '970x250', not used but available
      '970x90',
      '250x250',
      '200x200',
      '180x150',
      '125x125',
      // Adsense fallback by Ad Manager (smallest to biggest)
      '240x133',
      '300x100',
      '300x75',
      '480x320',
      '580x400',
      '750x100',
      '750x200',
      '750x300',
      '930x180',
      '950x90',
      '960x90',
      '970x66',
      '980x120',
      '980x90'
    ],
    computeBreakpointWidth: (width) => width + 8 * 2,
    computeBreakpointHeight: (height) => height,
    customFilter: (breakpointWidth, breakpointHeight, validAds) => {
      if (breakpointWidth >= 600) {
        const filteredAds = validAds.filter(([width, height]) => {
          return height <= 120
        })
        return filteredAds.sort((a, b) => b[0] * b[1] - a[0] * a[1])
      }
      return validAds.sort((a, b) => b[0] * b[1] - a[0] * a[1])
    }
  },
  {
    ads: [
      // Adsense (best to worst)
      '300x600',
      '120x600',
      '120x240',
      '160x600',
      '300x1050',
      '250x250',
      '200x200',
      '125x125',
      '300x250', // Not ranked but available & used
      // Adsense fallback by Ad Manager (smallest to biggest)
      '200x446',
      '240x400',
      '250x360',
      '320x480'
    ],
    computeBreakpointWidth: (width) => width * 2 + 1280 + 8 * 4,
    computeBreakpointHeight: (height) => height + 8 * 2,
    customFilter: (breakpointWidth, breakpointHeight, validAds) => {
      return validAds.sort((a, b) => b[0] * b[1] - a[0] * a[1])
    }
  }
]
