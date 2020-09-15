import {UnitNameInfo} from '../constants/types'

export const parseUnitSpecName = (text: string) => {
  const textFields = text.split('#')
  if (textFields.length > 2) {
    throw new Error(
      `more than one pound sign ('#') in the entry '${textFields}'`
    )
  }

  let nameInfo = textFields[0].split('__')
  let prefix = null

  if (textFields.length === 2) {
    nameInfo = textFields[1].split('__')
    prefix = textFields[0]
  }

  const info: UnitNameInfo = {
    name: nameInfo[0],
  }

  if (prefix) info.prefix = prefix

  if (nameInfo.length > 1) info.detail = nameInfo[1]
  return info
}
