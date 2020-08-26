const fs = require('fs-extra')
// const desiredMode = 0o2775
const options = {
  mode: 0o2775,
}

async function makeDir(dirName: string) {
  try {
    await fs.ensureDir(dirName, options)
    // console.log('success creating dirs')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}

export async function makeDirs(dirList: string[]) {
  await Promise.all(dirList.map(item => makeDir(item)))
}
