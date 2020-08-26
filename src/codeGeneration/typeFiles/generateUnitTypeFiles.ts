import {unitTypes} from '../../constants'
import {Sources, StackInfo} from '../../constants/types'
import {generateFilesForType} from './generateFilesForType'

export async function generateUnitTypeFiles(
  sources: Sources,
  source: string,
  userClass: string,
  currentStack: StackInfo,
) {
  const sourceInfo = sources[source]
  const {owner} = sourceInfo
  // console.log(`source=${source}, userClass=${userClass}, owner=${owner}`)
  // console.log(`source=${source}, sourceInfo=${JSON.stringify(sourceInfo, null, 2)}`)
  if (owner !== userClass) return

  try {
    const highestLevel = 'highestLevel'
    const selectedTree = {...sourceInfo.selectedTree}
    const highestLevelList = selectedTree[highestLevel]
    let selectionRoot = highestLevelList[0]
    const root = sourceInfo.root
    if (highestLevelList.length > 1) {
      selectedTree[root] = highestLevelList
      sourceInfo.selectedTree[root] = highestLevelList
      selectionRoot = root
    }
    delete selectedTree[highestLevel]

    // console.log(`source ${source} sourceInfo.unitType=${sourceInfo.unitType}`)
    if (sourceInfo.unitType === unitTypes.DATA_SOURCE) return

    const selectedTreeTypes = Object.keys(selectedTree)

    console.log(`source ${source} selectedTreeTypes=${JSON.stringify(selectedTreeTypes)}`)
    let j
    for (j = 0; j < selectedTreeTypes.length; j++) {
      const type = selectedTreeTypes[j]
      // console.log(`*** typeName=${typeName}`)
      // eslint-disable-next-line no-await-in-loop
      await generateFilesForType(currentStack, type, source, selectionRoot, root, sourceInfo, highestLevel)
    }

    const joins = sourceInfo.joins
    console.log(`about to look at joins=${JSON.stringify(joins)}`)
    if (joins) {
      for (j = 0; j < Object.keys(joins).length; j++) {
        const joinName = Object.keys(joins)[j]
        console.log(`joinName=${joinName}`)
        // eslint-disable-next-line no-await-in-loop
        // await generateFilesForType(currentStack, type, source, selectionRoot, root, sourceInfo, highestLevel)
      }
    }
  } catch (sourceCreationError) {
    throw new Error(`error creating unit ${source}: ${sourceCreationError}`)
  }
}
