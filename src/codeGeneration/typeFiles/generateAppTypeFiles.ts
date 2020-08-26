import {Sources, StackInfo} from '../../constants/types'
import {generateUnitTypeFiles} from './generateUnitTypeFiles'

export async function generateAppTypeFiles(units: Sources, userClass: string, currentStack: StackInfo) {
  const unitKeys = Object.keys(units)

  let i
  for (i = 0; i < unitKeys.length; i++) {
    const unit = unitKeys[i]
    console.log(`in generateAppTypeFiles, about to generate for unit ${unit}`)

    // eslint-disable-next-line no-await-in-loop
    await generateUnitTypeFiles(units, unit, userClass, currentStack)
  }
}
