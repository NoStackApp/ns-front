import {singularName} from '../tools/inflections'
import {parseSpecName} from '../constants/parseSpecName'

export const unitNameFromSpec = (text: string) => {
  return singularName(parseSpecName(text).name)
}
