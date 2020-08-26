export const liveServer = 'https://api.matchlynx.com/graphql'
// export const liveServer = 'https://api.matchlynx.com/graphql'
// export const liveServer = 'https://qq0we0b5s4.execute-api.us-east-1.amazonaws.com/dev/graphql'

export const associationTypes = {
  MULTIPLE: 'multiple',
  SINGLE_REQUIRED: 'singleRequired',
  SELECTABLE: 'selectable',
  // VIEWABLE: 'viewable',
}

export const dataTypes = {
  STRING: 'string',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
  GROUPING: 'grouping',
}

export const nodeTypes = {
  NONROOT: 'nonRoot',
  ROOT: 'Root',
  PROPERTY: 'Property',
  SELECTABLE: 'selectable',
}

export const formTypes = {
  CREATION: 'creation',
  SINGLE_INSTANCE: 'single',
  LIST: 'list',
  SELECTION: 'selection',
}

export const unitTypes = {
  INTERACTIVE: 'interactive',
  DATA_SOURCE: 'dataSource',
}

export interface BoilerPlateInfoType {
  formType: string;
  dataType: string;
  nodeType: string;
}

export const boilerPlateTypes = {
  CREATION_ROOT: `${formTypes.CREATION}${dataTypes.STRING}${nodeTypes.ROOT}`,
  CREATION_NON_ROOT: `${formTypes.CREATION}${dataTypes.STRING}${nodeTypes.NONROOT}`,
  CREATION_SELECTABLE: `${formTypes.CREATION}${dataTypes.STRING}${nodeTypes.SELECTABLE}`,
  CREATION_ROOT_GROUPING: `${formTypes.CREATION}${dataTypes.GROUPING}${nodeTypes.ROOT}`,
  CREATION_NON_ROOT_GROUPING: `${formTypes.CREATION}${dataTypes.GROUPING}${nodeTypes.NONROOT}`,
  MULTIPLE_NON_ROOT: `${formTypes.LIST}${dataTypes.STRING}${nodeTypes.NONROOT}`,
  MULTIPLE_SELECTABLE: `${formTypes.LIST}${dataTypes.STRING}${nodeTypes.SELECTABLE}`,
  MULTIPLE_ROOT: `${formTypes.LIST}${dataTypes.STRING}${nodeTypes.ROOT}`,
  MULTIPLE_NON_ROOT_GROUPING: `${formTypes.LIST}${dataTypes.GROUPING}${nodeTypes.NONROOT}`,
  MULTIPLE_ROOT_GROUPING: `${formTypes.LIST}${dataTypes.GROUPING}${nodeTypes.ROOT}`,
  SINGLE_NON_ROOT: `${formTypes.SINGLE_INSTANCE}${dataTypes.STRING}${nodeTypes.NONROOT}`,
  SINGLE_SELECTABLE: `${formTypes.SINGLE_INSTANCE}${dataTypes.STRING}${nodeTypes.SELECTABLE}`,
  SINGLE_ROOT: `${formTypes.SINGLE_INSTANCE}${dataTypes.STRING}${nodeTypes.ROOT}`,
  SINGLE_NON_ROOT_GROUPING: `${formTypes.SINGLE_INSTANCE}${dataTypes.GROUPING}${nodeTypes.NONROOT}`,
  SINGLE_ROOT_GROUPING: `${formTypes.SINGLE_INSTANCE}${dataTypes.GROUPING}${nodeTypes.ROOT}`,
  SINGLE_BOOLEAN: `${formTypes.SINGLE_INSTANCE}${dataTypes.BOOLEAN}${nodeTypes.PROPERTY}`,
  SINGLE_NUMBER: `${formTypes.SINGLE_INSTANCE}${dataTypes.NUMBER}${nodeTypes.PROPERTY}`,
  SINGLE_PROPERTY: `${formTypes.SINGLE_INSTANCE}${dataTypes.STRING}${nodeTypes.PROPERTY}`,
  SELECTION: `${formTypes.SELECTION}${dataTypes.STRING}${nodeTypes.SELECTABLE}`,
}

export const boilerPlates = {
  [boilerPlateTypes.CREATION_ROOT]: 'genericCreationFormRoot',
  [boilerPlateTypes.CREATION_NON_ROOT]: 'genericCreationFormNonRoot',
  [boilerPlateTypes.CREATION_SELECTABLE]: 'genericCreationFormSelectable',
  [boilerPlateTypes.CREATION_ROOT_GROUPING]: 'genericCreationFormRootGrouping',
  [boilerPlateTypes.CREATION_NON_ROOT_GROUPING]: 'genericCreationFormNonRootGrouping',
  [boilerPlateTypes.MULTIPLE_NON_ROOT]: 'genericMultipleNonRoot',
  [boilerPlateTypes.MULTIPLE_SELECTABLE]: 'genericMultipleSelectable',
  [boilerPlateTypes.MULTIPLE_ROOT]: 'genericMultipleRoot',
  [boilerPlateTypes.SINGLE_ROOT]: 'genericSingle',
  [boilerPlateTypes.SINGLE_NON_ROOT]: 'genericSingleNonRoot',
  [boilerPlateTypes.SINGLE_SELECTABLE]: 'genericSingleSelectable',
  [boilerPlateTypes.MULTIPLE_NON_ROOT_GROUPING]: 'genericMultipleNonRootGrouping',
  [boilerPlateTypes.MULTIPLE_ROOT_GROUPING]: 'genericMultipleRootGrouping',
  [boilerPlateTypes.SINGLE_ROOT_GROUPING]: 'genericSingleRootGrouping',
  [boilerPlateTypes.SINGLE_NON_ROOT_GROUPING]: 'genericSingleNonRootGrouping',
  [boilerPlateTypes.SINGLE_PROPERTY]: 'genericSingleProperty',
  [boilerPlateTypes.SINGLE_BOOLEAN]: 'genericSingleBoolean',
  [boilerPlateTypes.SINGLE_NUMBER]: 'genericSingleNumberProperty',
  [boilerPlateTypes.SELECTION]: 'genericSelection',
}

export const boilerplateDir = `${__dirname}/../../resources/boilerplates`
// console.log(`boilerplateDir =${boilerplateDir}`)

export  const standardActionIds = {
  VERIFY_TOKEN: '1279e113-d70f-4a95-9890-a5cebd344f3d',
  REFRESH_TOKEN: '96d3be63-53c5-418e-9167-71e3d43271e3',
  LOGIN: 'a0d89c1f-c423-45e0-9339-c719dcbb7afe',
}
