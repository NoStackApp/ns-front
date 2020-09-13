import {Configuration} from '../constants/types'

const fs = require('fs-extra')

const options = {
  mode: 0o2775,
}

export async function configuredDirs(
  config: Configuration,
  appDir: string,
  units: string[],
) {
  const {dirs} = config
  await Promise.all(Object.keys(dirs).map(
    async name => {
      const dir = `${appDir}/${dirs[name]}`
      try {
        await fs.ensureDir(dir, options)
        // console.log('success creating dirs')
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    },
  ))

  await Promise.all(Object.keys(units).map(
    async function (key: number) {
      const dir = `${appDir}/${config.dirs.components}/${units[key]}`
      try {
        await fs.ensureDir(dir, options)
      // console.log('success creating dirs')
      } catch (error) {
      // eslint-disable-next-line no-console
        console.error(error)
      }
    },
  ))
}
