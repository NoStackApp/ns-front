const fs = require('fs-extra')

import {StackInfo} from '../constants/types'
import {allCaps} from '../tools/inflections'

const Handlebars = require('handlebars')

import {sourcePropsDir} from './createTopProjectDirs'

const queryFileTemplate = Handlebars.compile(`import gql from 'graphql-tag';

  export const SOURCE_{{sourceAllCaps}}_QUERY = gql\`
  query UNIT(
    $id: ID!
    $typeRelationships: String!
    $parameters: String
  ) {
    unitData(
      unitId: $id
      typeRelationships: $typeRelationships
      parameters: $parameters
    )
    {
      {{queryBody}}
    }
  }
\`;

export const {{sourceAllCaps}}_RELATIONSHIPS = {
   {{typeRelationships}},
};`)

export async function createQueryFile(currentStack: StackInfo, source: string) {
  const sourceInfo = currentStack.sources[source]

  const queryFileText = queryFileTemplate({
    sourceAllCaps: allCaps(source),
    queryBody: sourceInfo.props.queryBody,
    typeRelationships: sourceInfo.props.typeRelationships,
  })

  const queryFile = `${sourcePropsDir}/${source}.js`
  try {
    await fs.outputFile(queryFile, queryFileText)
  } catch (error) {
    console.error(error)
  }
}
