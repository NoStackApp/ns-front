import {Configuration, Schema, Units} from '../../constants/types'

import {newUnit} from  './newUnit'

export function addUnits(units: Units, schema: Schema, config: Configuration) {
  if (units) {
    Object.keys(units).map(unitString => {
      const unitInfo = units[unitString]
      newUnit(schema, unitString, unitInfo, config)
    })
  }
  return schema
}
