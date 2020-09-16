import {AppInfo} from './types'

const fs = require('fs-extra')
const yaml = require('js-yaml')

export async function getAppInfo(appFile: string) {
  let appInfo: AppInfo
  try {
    const appYaml = fs.readFileSync(appFile, 'utf8')
    appInfo = await yaml.safeLoad(appYaml)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error opening app.yml')
    throw error
  }
  return appInfo
}
