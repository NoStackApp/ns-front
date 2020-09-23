import {associationTypes, BoilerPlateInfoType, dataTypes, formTypes, nodeTypes} from '../../constants'
import {AppInfo, SourceInfo, Schema} from '../../constants/types'
import {generateTypeFile} from './generateTypeFile'

export async function generateFilesForType(
  appInfo: AppInfo,
  schema: Schema,
  type: string,
  source: string,
  selectionRoot: string,
  root: string,
  sourceInfo: SourceInfo,
  highestLevel: string,
  templateDir: string,
  compDir: string,
) {
  const typeInfo = schema.types[type]
  const typeSourceInfo = typeInfo.sources[source]
  const {assnType, sourceUnit} = typeSourceInfo
  let {nodeType} = typeSourceInfo
  let {dataType} = typeInfo

  if (selectionRoot === type) nodeType = nodeTypes.ROOT

  let formType = formTypes.SINGLE_INSTANCE

  if (type === root && type !== sourceInfo.selectedTree[highestLevel][0]) {
    // this is the root, being used as the highest level component even though
    // it is not selected.  Therefore, it must be treated as a grouping in order to
    // show a list of true highest level components.
    formType = formTypes.SINGLE_INSTANCE
    dataType = dataTypes.GROUPING
    nodeType = nodeTypes.ROOT
  }

  const boilerPlateInfo: BoilerPlateInfoType = {
    formType,
    dataType,
    nodeType,
  }
  // console.log(`*** typeName=${typeName}, assnType=${assnType}, nodeType=${nodeType}`)

  // const templateLocation = '/home/yisroel/projects/nsBasicTemplate'
  // const templateLocation = 'https://raw.githubusercontent.com/YizYah/basicNsFrontTemplate/master/'
  if (sourceUnit) {
    const selectionBoilerPlateInfo: BoilerPlateInfoType = {
      formType: formTypes.SELECTION,
      dataType,
      nodeType: nodeTypes.SELECTABLE,
    }
    await generateTypeFile(
      type,
      sourceUnit,
      selectionBoilerPlateInfo,
      appInfo,
      schema,
      templateDir,
      compDir
    )
  }

  await generateTypeFile(
    type,
    source,
    boilerPlateInfo,
    appInfo,
    schema,
    templateDir,
    compDir
  )

  // console.log(`assnType=${assnType}`)
  if (assnType !== associationTypes.SINGLE_REQUIRED) {
    // console.log('assnType === associationTypes.MULTIPLE is true!')
    const creationBoilerPlateInfo = {
      formType: formTypes.CREATION,
      dataType,
      nodeType,
    }

    await generateTypeFile(
      type,
      source,
      creationBoilerPlateInfo,
      appInfo,
      schema,
      templateDir,
      compDir
    )

    const singularBoilerPlateInfo = {
      formType: formTypes.LIST,
      dataType,
      nodeType,
    }
    await generateTypeFile(
      type,
      source,
      singularBoilerPlateInfo,
      appInfo,
      schema,
      templateDir,
      compDir
    )
  }
}
