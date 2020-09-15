// const findInFiles = require('find-in-files')
import {regExAddedCodeSection} from '../constants/Regex/regExAddedCodeSection'
// import {regExFileInfo} from '../constants/Regex/regExFileInfo'
import {regExReplacedCodeSection} from '../constants/Regex/regExReplacedCodeSection'
import {CustomCodeRepository} from '../constants/types'

const fs = require('fs-extra')
const readdir = require('@mrmlnc/readdir-enhanced')
// const recursive = require('recursive-readdir')

// const regEx = /(\/\/|{\/\*) np__added_start unit: (\w*), comp: (\w*), loc: (\w*)( \*\/\}\n|\n)((.|\n)*?)(\/\/|{\/\*) np__added_end/g

async function storeCustomCodeForFile(file: string, customCode: CustomCodeRepository) {
  const {addedCode, replacedCode, removedCode} = customCode

  // console.log(`for file ${file}`);
  const fileText = await fs.readFile(file, 'utf-8')
  let fileUnit = ''
  let fileComponent = ''

  // temp
  const regexTextTest = '\\/\\/ ns__file unit: (\\w*), comp: (\\w*)'
  const regExFileInfoTest = new RegExp(regexTextTest, 'g')
  const regexRemovedTest = '\\/\\/ ns__remove_import (\\w*)'
  const regExRemoved = new RegExp(regexRemovedTest, 'g')

  const fileInfoMatch = regExFileInfoTest.exec(fileText)
  // console.log(`fileInfoMatch: ${JSON.stringify(fileInfoMatch)}`);

  if (fileInfoMatch) {
    fileUnit = fileInfoMatch[1]
    fileComponent = fileInfoMatch[2]
    // console.log(`file=${file}: fileUnit=${fileUnit}, fileComponent=${fileComponent}`)
  } else {
    // console.log(`DIDN'T WORK! regExFileInfoTest.exec(fileText)=${JSON.stringify(regExFileInfoTest.exec(fileText))}`)
  }
  // console.log(`fileText: ${fileText}`)

  let match
  // eslint-disable-next-line no-cond-assign
  while (match = regExAddedCodeSection.exec(fileText)) {
    // if (!output[match[1]])
    const unit: string = match[2]
    const component: string = match[3]
    const location: string = match[4]
    // const firstLineEnding = match[5]
    let contents = match[6]
    if (!contents || contents === '') contents = ' '
    // console.log(`match found: unit: ${unit} component: ${component} location: ${location} contents: ${contents}`)
    // console.log(`match found: unit: ${unit} component: ${component} location: ${location}`)
    if (!addedCode[unit]) addedCode[unit] = {}
    if (!addedCode[unit][component]) addedCode[unit][component] = {}
    addedCode[unit][component][location] = contents
  }

  // eslint-disable-next-line no-cond-assign
  while (match = regExReplacedCodeSection.exec(fileText)) {
    // if (!output[match[1]])
    const unit = fileUnit
    const component = fileComponent
    const location = match[2]
    // const firstLineEnding = match[5]
    let contents = match[4]
    if (!contents || contents === '') contents = ' '
    // const firstLineEnding = match[5]

    // console.log(`match found: unit: ${unit} component: ${component} location: ${location} contents: ${contents}`)
    // console.log(`**MATCH FOUND** for replace in ${file}: unit: ${unit} component: ${component} location: ${location}`)
    if (!replacedCode[unit]) replacedCode[unit] = {}
    if (!replacedCode[unit][component])
      replacedCode[unit][component] = {}
    replacedCode[unit][component][location] = contents
  }

  // eslint-disable-next-line no-cond-assign
  while (match = regExRemoved.exec(fileText)) {
    // if (!output[match[1]])
    const unit = fileUnit
    const component = fileComponent
    const location = match[1]
    // console.log(`**MATCH FOUND** for remove in ${file}: unit: ${unit} component: ${component} location: ${location}`)
    if (!removedCode[unit]) removedCode[unit] = {}
    if (!removedCode[unit][component])
      removedCode[unit][component] = {}
    removedCode[unit][component][location] = 'true'
  }
}

export const storeAddedCode = async (rootDir: string) => {
  const compsDir = rootDir + '/src/components/'
  const metaDir = rootDir + '/meta/'
  const customCodeFile = metaDir + 'addedCode.json'

  const existsComponents = await fs.pathExists(compsDir)
  if (!existsComponents) return

  const files = readdir.sync(compsDir, {deep: true, filter: '**/*.{js,jsx}'})
  // console.log(`files: ${JSON.stringify(files, null, 2)}`)

  const customCode: CustomCodeRepository = {
    addedCode: {},
    replacedCode: {},
    removedCode: {},
  }

  let i
  for (i = 0; i < files.length; i++) {
    const file = compsDir + files[i]
    // eslint-disable-next-line no-await-in-loop
    await storeCustomCodeForFile(file, customCode)
  }

  // console.log(`addedCode: ${JSON.stringify(addedCode, null, 2)}`)
  await fs.writeJson(customCodeFile, customCode)
}
