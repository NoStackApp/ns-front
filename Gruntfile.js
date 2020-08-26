/*
    Note: this should be replaced with grunt-ts.  We should be able to import from the
    regex files.
 */

const fs = require('fs-extra');

let customCodeObject = {};
let addedCodeObject = {};
let replacedCodeObject = {};
// let removedCodeObject = {};

// the following should not be here.  Should be exported from constants/regExAddedCodeSections.
// but grunt isn't set up to import from external ts files.
const commentOpen = '(\\/\\/|{\\/\\*)';
const endOfFirstLine = '( \\*\\/\\}\\n|\\n)';

const locationSpec = '(\\w*), comp: (\\w*), loc: (\\w*)';
const locationRepetition = '\\2, comp: \\3, loc: \\4'

const content = '((.|\n)*?)';

// Added Code
const firstLineBody = `${commentOpen} ns__custom_start unit: ${locationSpec}${endOfFirstLine}`;
const fullRegExBody = `${firstLineBody}${content}${commentOpen} ns__custom_end`;
const regExAddedCodeSection = new RegExp(fullRegExBody, 'g');
const regExForFirstLine = new RegExp(firstLineBody);

// FindReplacedCode: looks for start sections and then sees whether they are replaced.  If so, changes start delimiter.
/*
    NOTE: the reason for this step is that the replacement utility I'm using doesn't
    seem to be able to handle embedded searches.  That is, if I have a section and a
    subsection, it will not see the subsection.  For instance, if section A contains
    a section A1, and A1 is replaced, just searching for sections will never find A1.
    Because once A is found, nothing in it will be searched further.

    I don't know whether that's supposed to be that way or a bug.  I also don't
    know whether there's a parameter that solves the problem, but if so I have
    not found it.  So, I use this workaround: I look only for the starting delimiter.
    I check whether any such section is replaced.

    If it has been replaced, I tag it as such. I then search for the tagged
    "replacement" sections.
    This takes advantage of the fact that of course a section and a subsection within
    it cannot both be replaced.
 */
const replaceFindFirstLineBody = `${commentOpen} ns__start_section unit: ${locationSpec}${endOfFirstLine}`
const regExreplaceFindCodeSection = new RegExp(replaceFindFirstLineBody, 'g')
const replaceFindRegExForFirstLine = new RegExp(replaceFindFirstLineBody);

// replaced code--looks for changed start delimiter and then replaces it.
const replacementFirstLineBody = `${commentOpen} ns__start_replacement unit: ${locationSpec}${endOfFirstLine}`
const replacementFullRegExBody = `${replacementFirstLineBody}${content}${commentOpen} ns__end_section unit: ${locationRepetition}${endOfFirstLine}`
const regExReplacementCodeSection = new RegExp(replacementFullRegExBody, 'g')
// const regExForReplacementFirstLine = new RegExp(replacementFirstLineBody);

// clean up
const delimiter = `${commentOpen} ns__(start|end)_section unit: ${locationSpec}${endOfFirstLine}`
const regExCleanUp = new RegExp(delimiter, 'g')

module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    replace: {
      addedCode: {
        src: [grunt.option('testDir') + '/src/components/**/*.jsx', grunt.option('testDir') +
        '/src/components/**/*.js'],
        overwrite: true,             // destination directory or file
        replacements: [
          {
            from: regExAddedCodeSection,
            to: function (matchedWord) {   // callback replacement
              const lines = matchedWord.split('\n');
              const firstLine = lines[0];
              const lastLine = lines[lines.length - 1];
              // grunt.log.write(`firstLine = ${firstLine}`);

              const match = regExForFirstLine.exec(firstLine + '\n');
              // console.log(`match: ${JSON.stringify(match, null, 2)}`);
              // const firstLineOpening = match[1];
              const unit = match[2];
              const component = match[3];
              const location = match[4];
              // const firstLineEnding = match[5];
              // console.log(`match found: unit: ${unit} component: ${component} location: ${location}`);
              // console.log(`content = ${JSON.stringify(addedCodeObject,null,2)}`);

              if (!addedCodeObject[unit] ||
                !addedCodeObject[unit][component] ||
                !addedCodeObject[unit][component][location]) {
                return firstLine + '\n' + lastLine.trimLeft();
              }

              const stringToInsert = firstLine + '\n' + addedCodeObject[unit][component][location] + lastLine.trimLeft();
              // console.log(`stringToInsert: ${stringToInsert}`);
              return stringToInsert;
            },
          },
        ],
      },

      FindReplacedCode: {
        src: [grunt.option('testDir') + '/src/components/**/*.jsx', grunt.option('testDir') +
        '/src/components/**/*.js'],
        overwrite: true,             // destination directory or file
        replacements: [
          {
            from: regExreplaceFindCodeSection,
            to: function (matchedWord) {   // callback replacement
              // grunt.log.write(`found to replace = ${matchedWord}\n`);

              const match = replaceFindRegExForFirstLine.exec(matchedWord + '\n');
              if (match) {
                // console.log(`gen match found: ${JSON.stringify(match, null, 2)}\n`);
                // const firstLineOpening = match[1];
                const unit = match[2];
                const component = match[3];
                const location = match[4];
                // const firstLineEnding = match[5];
                // console.log(`match found in FindReplacedCode: unit: ${unit} component: ${component} location: ${location}`);
                // console.log(`content = ${JSON.stringify(addedCodeObject,null,2)}`);

                // if (!replacedCodeObject[unit]);
                // if (!replacedCodeObject[unit][component]) grunt.fatal(`ERROR adding the code: component '${component}' for unit '${unit}' not found`);
                if (!replacedCodeObject[unit] ||
                  !replacedCodeObject[unit][component] ||
                  !replacedCodeObject[unit][component][location]
                )  {
                  // console.log('no replacement code.')
                  return matchedWord;
                }

                return matchedWord.replace('ns__start_section', 'ns__start_replacement');
              }
              // grunt.log.write('no match found in gen\n');
            },
          },
        ],
      },

      replacedCode: {
        src: [grunt.option('testDir') + '/src/components/**/*.jsx', grunt.option('testDir') +
        '/src/components/**/*.js'],
        overwrite: true,             // destination directory or file
        replacements: [
          {
            from: regExReplacementCodeSection,
            to: function (matchedWord, index, fullText, regexMatches) {   // callback replacement
              // const lines = matchedWord.split('\n');
              // const firstLine = lines[0];
              // const lastLine = lines[lines.length - 1];
              // console.log(`firstLine of gen = ${firstLine}`);
              // grunt.log.write(`lines of gen = ${JSON.stringify(lines, null, 2)}\n`);
              // grunt.log.write(`firstLine of gen = ${firstLine}\n`);

              // const match = regExForReplacementFirstLine.exec(firstLine + '\n');
              // if (match) {
              console.log(`gen match found: ${JSON.stringify(regexMatches, null, 2)}\n`);
              // const firstLineOpening = match[1];
              const header = regexMatches[0];
              const unit = regexMatches[1];
              const component = regexMatches[2];
              const location = regexMatches[3];
              const endOfFirstLine = regexMatches[4];
              const content = regexMatches[5];
              const headerOfLastLine = regexMatches[7];
              const endOfLastLine = regexMatches[8];

              // const firstLineEnding = match[5];
              console.log(`match found in replacements: unit: ${unit} component: ${component} location: ${location}`);
              // console.log(`content = ${JSON.stringify(addedCodeObject,null,2)}`);

              // if (!replacedCodeObject[unit]);
              // if (!replacedCodeObject[unit][component]) grunt.fatal(`ERROR adding the code: component '${component}' for unit '${unit}' not found`);
              // if (!replacedCodeObject[unit] ||
              //     !replacedCodeObject[unit][component] ||
              //     !replacedCodeObject[unit][component][location]
              // )  {
              //   // console.log('no replacement code.')
              //   lines[0] = `// ns__start_section ${location} ${endOfFirstLine}`
              //   lines[lines.length - 1] = `// ns__end_section ${location}${endOfLastLine}`
              //   return lines.join('\n');
              // }

              const replacementBody = replacedCodeObject[unit][component][location]

              const stringToInsert =
                `${header} ns__start_replacement ${location}${endOfFirstLine}
                  ${replacementBody}
                  ${headerOfLastLine} ns__end_replacement ${location}${endOfLastLine}`;
              console.log(`stringToInsert: ${stringToInsert}`);
              return stringToInsert;
              // }
              // grunt.log.write('no match found in gen\n');
            },
          },
        ],
      },

      cleanUp: {
        src: [grunt.option('testDir') + '/src/components/**/*.jsx', grunt.option('testDir') +
        '/src/components/**/*.js'],
        overwrite: true,             // destination directory or file
        replacements: [
          {
            from: regExCleanUp,
            to: function (matchedWord, index, fullText, regexMatches) {   // callback replacement
              // grunt.log.write(`found to clean up = ${matchedWord}. regexMatches=${JSON.stringify(regexMatches)} `);

              const opening = regexMatches[0];
              const prefix = regexMatches[1];
              const location = regexMatches[4];
              const endOfLine = regexMatches[5];

              const stringToInsert = `${opening} ns__${prefix}_section ${location}${endOfLine}`;
              return stringToInsert;
            },
          },
        ],
      },

      // removedCode: {
      //   src: [grunt.option('testDir') + '/src/components/**/*.jsx', grunt.option('testDir') +
      //   '/src/components/**/*.js'],
      //   overwrite: true,             // destination directory or file
      //   replacements: [
      //     {
      //       from: regExRemoveImport,
      //       to: function (matchedWord, index, fullText, regexMatches) {   // callback replacement
      //         if (removedCodeObject[unit] &&
      //           removedCodeObject[unit][component] &&
      //           removedCodeObject[unit][component][location]
      //         ) {
      //           return `\n${regexMatches[0]}// removed_${regexMatches[1]}`
      //         }
      //         return matchedWord
      //       },
      //     },
      //   ],
      // },

    },
  });

  async function setCustomCodeObject() {
    const addedCodeJsonFile = grunt.option('addedCodeDoc');
    console.log(`addedCodeJsonFile=${addedCodeJsonFile}`);

    const existsJsonFile = await fs.pathExists(addedCodeJsonFile);
    if (!existsJsonFile) {
      customCodeObject = {};
      fs.outputJson(addedCodeJsonFile, customCodeObject);
      console.log(`content = ${JSON.stringify(customCodeObject, null, 2)}`);
      return
    }

    try {
      customCodeObject = await fs.readJson(addedCodeJsonFile);
      addedCodeObject = customCodeObject.addedCode;
      replacedCodeObject = customCodeObject.replacedCode;
      // removedCodeObject = customCodeObject.removedCode;
      console.log(`content = ${JSON.stringify(customCodeObject, null, 2)}`);
    } catch (err) {
      grunt.fatal(`ERROR loading the added code: ${err}`);
    }
  }

  grunt.registerTask('setAddedCode', 'Grabs the added code from a json', async function () {
    // Force task into async mode and grab a handle to the "done" function.
    const done = this.async();

    // Get the added code
    setTimeout(async function () {
      await setCustomCodeObject();
      done();
    }, 1000);
  });

  // Load the plugin that provides the "replace" task.
  grunt.loadNpmTasks('grunt-text-replace');

  // Default task.
  // grunt.registerTask('default', ['replace']);
  grunt.registerTask('default', ['setAddedCode', 'replace']);
};
