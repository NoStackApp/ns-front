import {checkDirForDiscrepancies} from '../testing/checkDirForDiscrepancies'

export async function checkGeneratedUnits(
  units: [string],
  diffsDir: string,
  originalComps: string,
  generatedComps: string,
  logFile: string,
  problemsFound: boolean,
) {
  await Promise.all(units.map(async (unit: string) => {
    const diffsFile = `${diffsDir}/${unit}`
    const originalUnit = `${originalComps}/${unit}`
    const generatedUnit = `${generatedComps}/${unit}`
    const problemsFoundLocally = await checkDirForDiscrepancies(
      diffsFile,
      originalUnit,
      generatedUnit,
      logFile,
      problemsFound
    )
    problemsFound = problemsFound || problemsFoundLocally
  }))
  return problemsFound
}
