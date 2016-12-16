import hash from "./hash"

export default function (babel) {
  const { types: t, template } = babel;

  return {
    name: "ast-transform", // not required
    visitor: {
      Program(path, state) {
        const fileName = state.opts.fileName||"no-file"

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
                  path3.traverse({
                    TemplateLiteral(path4){
                      let {expressions} = path4.node
                      for(let i=0; i < expressions.length; i++){
                        let expression = expressions[i]
                        if(expression.type==="Identifier"){
                          expressions[i] = t.conditionalExpression(
                            t.memberExpression(expression, t.identifier("selector")),
                            t.memberExpression(expression, t.identifier("selector")),
                            expression
                          )
                        }
                      }

                    }
                  })


                  let {start,end} = path3.node.loc
                  path3.replaceWith(template(`(function(){
                    let x = React.createFactory(ORIG)
                    class y extends React.Component {
                      render(){
                        let {className} = this.props
                      	className = className?(className+" "+CLASS_NAME):className

                    	  return x(Object.assign({}, this.props, {["className"]: className}))
                      }
                      static get selector(){
                        return "." + CLASS_NAME
                      }
                    }
              			return y
              		})()`)({
                    ORIG: path3,
                    CLASS_NAME: t.stringLiteral("s-"+hash(`${fileName}-${start.line}_${start.column}__${end.line}_${end.column}`))
                  }))


                  path2.skip()
                  path3.skip()

                }
              }
            })

          }
        })
      }
    }
  }
}
