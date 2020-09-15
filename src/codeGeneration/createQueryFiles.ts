const fs = require('fs-extra')

import {AppInfo, Configuration} from '../constants/types'
import {allCaps} from '../tools/inflections'
import {loadFileTemplate} from './loadFileTemplate'
import {parseUnitSpecName} from './parseUnitSpecName'
import {unitNameFromSpec} from './unitNameFromSpec'

export async function createQueryFiles(config: Configuration, appInfo: AppInfo, appDir: string) {
  if (!appInfo.backend ||
    !appInfo.backend.queries ||
    !config.dirs.queries
  ) return

  // create query files in the directory specified by the template.
  const {units, template} = appInfo
  const queriesDir = `${appDir}/${config.dirs.queries}`

  const queryFileTemplate = await loadFileTemplate(`${template}/query.hbs`)
  try {
    await Promise.all(Object.keys(units).map(async unitKey => {
      const unit = unitNameFromSpec(unitKey)
      const keyInQueries = parseUnitSpecName(unitKey).name

      if (!appInfo.backend ||
        !appInfo.backend.queries ||
        !appInfo.backend.queries[unit]) return

      const unitQueryInfo = appInfo.backend.queries[keyInQueries]

      const queryFileText = queryFileTemplate({
        unitAllCaps: allCaps(unit),
        queryBody: unitQueryInfo.body,
        typeRelationships: unitQueryInfo.relationships,
      })

      const queryFile = `${queriesDir}/${unit}.js`
      try {
        await fs.outputFile(queryFile, queryFileText)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }

      // await createQueryFile(unitNameInfo.name, queriesDir, appInfo, template)
    }))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    throw new Error('error in creating query file')
  }
}
