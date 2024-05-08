import * as fs from 'fs'
import * as path from 'path'

const schemaDirectoryPath = './src/api/schema/institute' // Adjust the path accordingly

/**
 * Auto-generate export statements for schema files in a directory.
 *
 * @param {string} directoryPath - The path to the directory containing schema files.
 * @param {string} indexFileName - The name of the index file where exports will be written.
 */
function autoGenerateExports(directoryPath: string, indexFileName: string): void {
  try {
    // Read files in the directory
    const files: string[] = fs.readdirSync(directoryPath)

    // Filter schema files (adjust the regex based on your file naming conventions)
    const schemaFiles: string[] = files.filter(file => /\.(ts|js)$/i.test(file))

    // Generate export statements
    const exportStatements: string[] = schemaFiles.map(file => {
      const fileNameWithoutExtension = path.parse(file).name
      return `export * from './${fileNameWithoutExtension}';`
    })

    // Write export statements to the index file
    fs.writeFileSync(path.join(directoryPath, indexFileName), exportStatements.join('\n'), 'utf-8')

    console.log('Exports generated successfully.')
  } catch (error) {
    // Handle errors, e.g., log or throw
    console.error('Error generating exports:', error)
  }
}

// Example usage:
autoGenerateExports(schemaDirectoryPath, 'index.ts')
