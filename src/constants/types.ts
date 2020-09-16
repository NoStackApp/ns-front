export interface UserInfo {
  name: string;
  stack: string;
  stackId: string;
  password: string;
  refreshToken: string;
  accessToken: string;
  email: string;
  id: string;
  licenseId: string;
}

// export interface CreateOptions {
//   parent: string;
//   value: string;
//   level: string;
//   userInfo: UserInfo;
// }

interface PropsInfo {
  queryBody: string;
  typeRelationships: string;
}

export interface TreeTypeChildrenList {
  [type: string]: string;
}

interface SelectedTreeList {
  [type: string]: [string];
}

interface TreeTypeList {
  [type: string]: TreeTypeChildrenList;
}

interface ConnectedList {
  [type: string]: string;
}

interface ConstraintInfo {
  constraintType: string;
  typeName: string;
  constraintValue: string;
}

interface ConstraintsSet {
  [type: string]: ConstraintInfo;
}

interface JoinInfo {
  fromType: string;
  toUnit: string;
  toType: string;
  assnType: string;
  joinAssnId: string;
}

interface JoinsList {
  [join: string]: JoinInfo;
}

export interface SourceInfo {
  id: string;
  const: string;
  unitType: string;
  props: PropsInfo;
  name: string;
  depth: number;
  tree: TreeTypeList;
  selections: [];
  selectedTree: SelectedTreeList;
  constraints: ConstraintsSet;
  connections: ConnectedList;
  owner: string;
  root: string;
  selectionRoot: string;
  joins: JoinsList;
}

/*
    "user": {
      "name": "user",
      "id": "9f025291-ff2b-4ae7-9e89-d9a87ea6a080",
      "samples": {
        "tstNoStackMod1": {
          "id": "546decf9-6d66-4dc6-b3c6-f2451d427bb4",
          "suffix": "Mod",
          "owner": "tstNoStackMod1"
        },
 */
export interface UserClassInfo {
  name: string;
  id: string;
  topSource: string;
  samples: object;
}

export interface UserClasses {
  [userClassName: string]: UserClassInfo;
}

export interface Sources {
  [sourceName: string]: SourceInfo;
}

export interface TypeSourceInfo {
  assnType: string;
  sourceUnit: string;
  nodeType: string;
  parentType: string;
  children: string[];
}

export interface TypeSources {
  [sourceName: string]: TypeSourceInfo;
}

export interface TypeInfo {
  const: string;
  name: string;
  dataType: string;
  plural: string;
  sources: TypeSources;
  id: string;
}

export interface Types {
  [typeName: string]: TypeInfo;
}

export interface StackMeta {
  stackId: string;
}

export interface ActionInfo {
  const: string;
  actionName: string;
  userClass: string;
  actionType: string;
  type?: string;
  parentType?: string;
  source?: string;
  id: string;
}

export interface Actions {
  [actionKey: string]: ActionInfo;
}

export interface ActionsByActionType {
  [actionType: string]: Actions;
}

export interface StackInfo {
  topSource: string;
  userClasses: UserClasses;
  sources: Sources;
  types: Types;
  actions: ActionsByActionType;
  stack: StackMeta;
}

/*
  Added Code Object
 */
export interface CompInfo {
  [location: string]: string;
}
export interface UnitInfo {
  [comp: string]: CompInfo;
}
export interface CustomCodeCollection {
  [unit: string]: UnitInfo;
}

export interface CustomCodeRepository {
  addedCode: CustomCodeCollection;
  replacedCode: CustomCodeCollection;
  removedCode: CustomCodeCollection;
}

interface TypeHierarchy {
  [key: string]: string | TypeHierarchy | null;
}

interface UnitDiscription {
  userClass?: string;
  hierarchy: TypeHierarchy;
}

interface Units {
  [key: string]: UnitDiscription;
}

interface BackendIdList {
  [key: string]: string;
}

interface TypeActionIdList {
  [typeName: string]: BackendIdList;
}

interface ActionIdList {
  [unitName: string]: TypeActionIdList;
}

export interface BackendIds {
  stack?: string;
  units: BackendIdList;
  types: BackendIdList;
  actions?: ActionIdList;
}

interface BackendQueryData {
  body: string;
  relationships?: string;
}

interface BackendQueriesData {
  [type: string]: BackendQueryData;
}

interface BackendData {
  ids: BackendIds;
  queries?: BackendQueriesData;
  info: object;
}

interface AppTemplateInfo {
  name: string;
  version: string;
  dir: string;
}

export interface AppInfo {
  appName: string;
  template: AppTemplateInfo;
  userClass: string;
  units: Units;
  topUnits: string[];
  backend?: BackendData;
}

// following is a recursive Directory type.  A directory can contain
// either files or arrays of files/subdirectories.
export interface Directory {
  [key: string]: string | Directory;
}

interface ConfigurationDirectories {
  components: string;
  [key: string]: string;
}

export interface CommandSpec {
  title: string;
  file: string;
  arguments: string[];
  options?: object;
}

export interface PlaceholderAppCreation {
  mainInstallation?: string[];
  devInstallation?: string[];
  preCommands?: CommandSpec[];
}

export interface Configuration {
  name: string;
  version: string;
  category: string;
  dirs: ConfigurationDirectories;
  placeholderAppCreation: PlaceholderAppCreation;
}

export interface UnitNameInfo {
  name: string;
  detail?: string;
  prefix?: string;
}
