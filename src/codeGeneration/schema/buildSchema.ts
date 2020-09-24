'use strict'

import {AppInfo, Configuration, Schema} from '../../constants/types'
import {addUserClass} from './newUserClass'

import {addUnits} from './addUnits'
import {addJoins} from './addJoins'
import {setSelectionRoots} from './setSelectionRoots'
const emptySchema: Schema = {
  userClasses: {},
  sources: {},
  types: {},
  actions: {},
  topSource: '',
}

export const buildSchema = async (appInfo: AppInfo, config: Configuration) => {
  let schema: Schema = emptySchema

  const {units, userClass, joins} = appInfo
  schema = addUserClass(schema, userClass)

  schema = addUnits(units, schema, config)
  if (joins) {
    schema = addJoins(joins, schema)
  }

  schema = setSelectionRoots(schema)

  schema.backend = Object.assign({}, appInfo.backend)
  // console.log(`schema = ${JSON.stringify(schema, null, 2)}`)

  return schema
}
