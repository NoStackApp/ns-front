import {Sources, StackInfo} from '../../constants/types'
import {generateUnitTypeFiles} from './generateUnitTypeFiles'

export async function generateAppTypeFiles(
  units: Sources,
  userClass: string,
  currentStack: StackInfo,
  template: string,
  compDir: string
) {
  const unitKeys = Object.keys(units)

  let i
  for (i = 0; i < unitKeys.length; i++) {
    const unit = unitKeys[i]

    // eslint-disable-next-line no-await-in-loop
    await generateUnitTypeFiles(units, unit, userClass, currentStack, template, compDir)
  }
}
