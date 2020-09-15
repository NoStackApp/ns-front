import {StackInfo} from '../../constants/types'
import {generateUnitTypeFiles} from './generateUnitTypeFiles'

export async function generateAppTypeFiles(
  userClass: string,
  stackInfo: StackInfo,
  template: string,
  compDir: string
) {
  const units = stackInfo.sources
  const unitKeys = Object.keys(units)

  let i
  for (i = 0; i < unitKeys.length; i++) {
    const unit = unitKeys[i]

    // eslint-disable-next-line no-await-in-loop
    await generateUnitTypeFiles(unit, userClass, stackInfo, template, compDir)
  }
}
