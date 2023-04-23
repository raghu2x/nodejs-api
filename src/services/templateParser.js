const hbs = require('handlebars')
const fs = require('fs')
const path = require('path')

const templatesDir = path.join(__dirname, '..', 'templates')

const compileTemplate = (fileName, data) => {
  const htmlFilePath = path.join(templatesDir, fileName)
  const template = fs.readFileSync(htmlFilePath, 'utf8')
  // compile the template using handlebars
  const compiledTemplate = hbs.compile(template)

  // generate the HTML output using the compiled template and data
  const html = compiledTemplate(data)
  return html
}

module.exports = { compileTemplate }
