import {Schema} from '../../constants/types'

export const addUserClass = (schema: Schema, userClassName: string) => {
  schema.userClasses[userClassName] = {
    name: userClassName,
    topSource: '',
  }

  schema.types[userClassName] = {
    name: userClassName,
    dataType: 'string',
    sources: {},
  }

  return schema
}
