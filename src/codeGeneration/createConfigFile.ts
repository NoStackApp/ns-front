import {StackInfo} from '../constants/types'
import {loadFileTemplate} from './loadFileTemplate'

// const fileExplanation = Handlebars.compile(`/*
//   This file was generated automatically by ns-front 'makecode'
//   for the app '{{appName}}'.
//   If you build a new stack from a template, this version will probably need to change.
//
//   For instance, it will update if you run 'makecode' again. Fair warning, that will
//   change a lot of your code. If you modify your current stack to add actions, sources,
//   or types, it would make sense to add constants here.
//
//   But, you should *not* add permanent, separate configuration material
//   or other material that is not directly managed by NoStack,
//   because this will will be replaced with every call to 'makecode'.
//  */
// `)
//
// const platformId = Handlebars.compile(`
// // stack id
// export const PLATFORM_ID = '{{stackId}}';
// `)
//
// const actionDeclarations = Handlebars.compile(`
// // actions
// {{#each actionTypes}}
//     // {{actionType}}
//   {{#each actions}}
//     export const {{actionConst}}='{{actionId}}';
//   {{/each}}
//
// {{/each}}
// `)
//
// const sourceConstDeclarations = Handlebars.compile(`
// // sources
// {{#sources}}
// export const {{sourceConst}}='{{sourceId}}';
// {{/sources}}
// `)
//
// const typeConstDeclarations = Handlebars.compile(`
// // types
// {{#types}}
// export const {{typeConst}}='{{typeId}}';
// {{/types}}
// `)

export async function createConfigFile(
  currentStack: StackInfo,
  appName: string,
  template: string
) {
  const configTemplate = await loadFileTemplate(`${template}/config.hbs`)

  const actionTypeList = Object.keys(currentStack.actions).map(actionType => {
    const actionsForCurrentType = currentStack.actions[actionType]
    return {
      actionType,
      actions: Object.keys(actionsForCurrentType).map(action => {
        const currentActionInfo = actionsForCurrentType[action]
        return {
          actionConst: currentActionInfo.const,
          actionId: currentActionInfo.id,
        }
      }),
    }
  })

  const sourceList = Object.keys(currentStack.sources).map(sourceName => {
    const currentSourceInfo = currentStack.sources[sourceName]
    return {
      sourceConst: currentSourceInfo.const,
      sourceId: currentSourceInfo.id,
    }
  })

  const typesText = Object.keys(currentStack.types).map(typeName => {
    const currentTypeInfo = currentStack.types[typeName]
    return {
      typeConst: currentTypeInfo.const,
      typeId: currentTypeInfo.id,
    }
  })

  // const outputText = fileExplanation({appName}) +
  //   platformId({stackId: currentStack.stack.stackId}) +
  //   sourceConstDeclarations({sources: sourceList}) +
  //   typeConstDeclarations({types: typesText}) +
  //   actionDeclarations({actionTypes: actionTypeList})

  const configContext = {
    appName,
    stackId: currentStack.stack.stackId,
    sources: sourceList,
    types: typesText,
    actionTypes: actionTypeList,
  }

  return configTemplate(configContext)
}
