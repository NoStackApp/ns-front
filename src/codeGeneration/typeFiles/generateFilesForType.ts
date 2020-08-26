import {associationTypes, BoilerPlateInfoType, dataTypes, formTypes, nodeTypes} from '../../constants'
import {SourceInfo, StackInfo} from '../../constants/types'
import {generateTypeFile} from './generateTypeFile'

export async function generateFilesForType(
  currentStack: StackInfo,
  type: string,
  source: string,
  selectionRoot: string,
  root: string,
  sourceInfo: SourceInfo,
  highestLevel: string,
) {
  const typeInfo = currentStack.types[type]
  const typeSourceInfo = typeInfo.sources[source]
  const {assnType, sourceUnit} = typeSourceInfo
  let {nodeType} = typeSourceInfo
  let {dataType} = typeInfo

  if (selectionRoot === type) nodeType = nodeTypes.ROOT

  let formType = formTypes.SINGLE_INSTANCE

  if (type === root && type !== sourceInfo.selectedTree[highestLevel][0]) {
    console.log(`${type} is root for ${source}`)
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

  if (sourceUnit) {
    const selectionBoilerPlateInfo: BoilerPlateInfoType = {
      formType: formTypes.SELECTION,
      dataType,
      nodeType: nodeTypes.SELECTABLE,
    }
    await generateTypeFile(type, sourceUnit, selectionBoilerPlateInfo, currentStack)
  }

  await generateTypeFile(type, source, boilerPlateInfo, currentStack)

  // console.log(`assnType=${assnType}`)
  if (assnType !== associationTypes.SINGLE_REQUIRED) {
    // console.log('assnType === associationTypes.MULTIPLE is true!')
    const creationBoilerPlateInfo = {
      formType: formTypes.CREATION,
      dataType,
      nodeType,
    }
    await generateTypeFile(type, source, creationBoilerPlateInfo, currentStack)

    const singularBoilerPlateInfo = {
      formType: formTypes.LIST,
      dataType,
      nodeType,
    }
    await generateTypeFile(type, source, singularBoilerPlateInfo, currentStack)
  }
}
