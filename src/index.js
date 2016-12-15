export default function (babel) {
  const { types: t, template } = babel;

  return {
    name: "babel-plugin-styled-components-selector", // not required
    visitor: {
      Program(path, state) {
        // Default imported variable name to "styled", adjust based on import below
        let importedVariableName = 'styled'

        const isStyled = (tag) => (tag.object && tag.object.name === importedVariableName) || (tag.callee && tag.callee.name === importedVariableName)

        path.traverse({
          ImportDeclaration(path) {
            // Is the styled-components import!
            if (path.node.source.value === 'styled-components') {
              // If the default is imported it's at defaultImport[0], otherwise defaultImport is empty
              const defaultImport = path.get('specifiers').find((specifier) => {
                return specifier.isImportDefaultSpecifier() || specifier.isImportSpecifier() && specifier.node.imported.name === 'default'
              })
              if (defaultImport) {
                // Save the imported name
                importedVariableName = defaultImport.node.local.name
              }
            }
          }
        })

        path.traverse({
          VariableDeclarator(path2){

            path2.traverse({
              TaggedTemplateExpression(path3){
                let {tag} = path3.node

                if(
                  (tag.type==="CallExpression" && tag.callee.name===importedVariableName)
                  ||(tag.type==="MemberExpression" && tag.object.name===importedVariableName)
                ){
                  path2.insertAfter(
                    t.assignmentExpression(
                      "=",
                      t.memberExpression(path2.node.id, t.identifier('toString')),
                      t.arrowFunctionExpression([], t.stringLiteral("xx"))
                    )
                  )
                }
              }
            })

          }
        })
      }
    }
  }
}
