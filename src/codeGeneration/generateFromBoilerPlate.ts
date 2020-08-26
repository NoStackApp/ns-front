
const fs = require('fs-extra')
const replace = require('replace-in-file')

export async function generateFromBoilerPlate(
  boilerPlate: string,
  newFile: string,
  substitutions: object,
) {
  // console.log(`boilerPlate=${boilerPlate}, newFile=${newFile}`)
  try {
    await fs.copy(boilerPlate, newFile)
    // console.log('success!')
  } catch (err) {
    console.error(err)
  }

  const options: object = substitutions
  // @ts-ignore
  substitutions.files = newFile

  try {
    await replace(options)
    // const results = await replace(options)
    // console.log('Replacement results:', results)
  } catch (error) {
    console.error('Error occurred:', error)
  }
}
