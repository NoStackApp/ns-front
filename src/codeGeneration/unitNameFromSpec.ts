import {singularName} from '../tools/inflections'
import {parseUnitSpecName} from './parseUnitSpecName'

export const unitNameFromSpec = (text: string) => {
  return singularName(parseUnitSpecName(text).name)
}
