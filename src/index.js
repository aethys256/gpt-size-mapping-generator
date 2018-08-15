import fs from 'fs'
import sizesToMap from './sizes'

let sizeMapping = ''
for (const sizeToMap of sizesToMap) {
  sizeMapping += '####################\n'

  // Get the breakpoint formulas
  const {computeBreakpointWidth, computeBreakpointHeight, customFilter} = sizeToMap

  // Build an object with all the ads properties (width, height, breakpoints) + add encountered breakpoints to an index
  const breakpoints = {width: {}, height: {}}
  const ads = {}
  for (const ad of sizeToMap.ads) {
    // Extract width & height from the size string
    const [widthStr, heightStr] = ad.split('x')
    const width = parseInt(widthStr)
    const height = parseInt(heightStr)

    // Compute ad breakpoints
    const breakpointWidth = computeBreakpointWidth(width)
    if (!breakpoints.width[breakpointWidth]) {
      breakpoints.width[breakpointWidth] = [ad]
    } else {
      breakpoints.width[breakpointWidth].push(ad)
    }
    const breakpointHeight = computeBreakpointHeight(height)
    if (!breakpoints.height[breakpointHeight]) {
      breakpoints.height[breakpointHeight] = [ad]
    } else {
      breakpoints.height[breakpointHeight].push(ad)
    }

    // Save the ad properties
    ads[ad] = {width, height, breakpoint: {width: breakpointWidth, height: breakpointHeight}}
  }

  // Do sort our breakpoints (by converting the breakpoints objects to arrays then sort them)
  const breakpointsSorted = {width: [], height: []}
  for (const key in breakpoints.width) {
    if (!breakpoints.width.hasOwnProperty(key)) continue
    const value = breakpoints.width[key]
    breakpointsSorted.width.push([parseInt(key), value])
  }
  for (const key in breakpoints.height) {
    if (!breakpoints.height.hasOwnProperty(key)) continue
    const value = breakpoints.height[key]
    breakpointsSorted.height.push([parseInt(key), value])
  }
  breakpointsSorted.width.sort((a, b) => a[0] - b[0])
  breakpointsSorted.height.sort((a, b) => a[0] - b[0])

  // Iterate over the width breakpoints first since GPT start its scan by the width
  for (let i = 0; i < breakpointsSorted.width.length; i++) {
    const widthBreakpointValue = breakpointsSorted.width[i][0]
    // Used to keep an index of the ads with lower height breakpoints, since we need to also include them
    const validAds = []
    // Iterate over all the height breakpoints
    for (let j = 0; j < breakpointsSorted.height.length; j++) {
      const heightBreakpointValue = breakpointsSorted.height[j][0]
      const heightBreakpointAds = breakpointsSorted.height[j][1].slice(0) // slice to makes a shallow copy since we'll sort it

      // Filters the ads that doesn't meet the width requirement
      const filteredAds = heightBreakpointAds.filter((adKey) => {
        const ad = ads[adKey]
        return ad.breakpoint.width <= widthBreakpointValue
      })
      // Skip to the next breakpoint if there is no ad once filtered
      if (filteredAds.length === 0) continue

      // Add the filtered ads to the valid ones
      for (const adKey of filteredAds) {
        const ad = ads[adKey]
        validAds.push([ad.width, ad.height])
      }

      // Apply custom filter
      const finalAds = customFilter(widthBreakpointValue, heightBreakpointValue, validAds)

      // Write the sizeMap format
      const sizeMap = `.addSize([${widthBreakpointValue},${heightBreakpointValue}],[[${finalAds.join('],[')}]])`
      sizeMapping += `${sizeMap.replace(/,/g, ', ')}\n`
    }
  }
  sizeMapping += '\n'
}

fs.writeFile('sizeMapping.txt', sizeMapping, (err) => { if (err) console.err(err) })
