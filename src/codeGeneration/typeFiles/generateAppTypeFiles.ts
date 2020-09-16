import {StackInfo} from '../../constants/types'
import {generateUnitTypeFiles} from './generateUnitTypeFiles'

export async function generateAppTypeFiles(
  userClass: string,
  stackInfo: StackInfo,
  templateDir: string,
  compDir: string
) {
  const units = stackInfo.sources
  const unitKeys = Object.keys(units)

  console.log(`in generateAppTypeFiles, compDir=${compDir}`)
  let i
  for (i = 0; i < unitKeys.length; i++) {
    const unit = unitKeys[i]

    // eslint-disable-next-line no-await-in-loop
    await generateUnitTypeFiles(unit, userClass, stackInfo, templateDir, compDir)
  }
}
