import {formTypes} from '../../constants'
import {pluralName, singularName} from '../../tools/inflections'

export const boilerPlateToDir = (type: string, formType: string) => {
  const mappingObject = {
    [formTypes.SINGLE_INSTANCE]: singularName(type),
    [formTypes.CREATION]: singularName(type) + 'CreationForm',
    [formTypes.LIST]: pluralName(type),
    [formTypes.SELECTION]: singularName(type) + 'Select',
  }
  return mappingObject[formType]
}
