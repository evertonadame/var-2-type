import * as esprima from "esprima";

interface ExtractedObject {
  object: Record<string, any> | null;
  varName: string | null;
}

function extractObjectFromCode(code: string): ExtractedObject {
  const ast = esprima.parseScript(code, { range: true });
  let extractedObject: ExtractedObject = { object: null, varName: null };

  ast.body.forEach((node) => {
    if (node.type === "VariableDeclaration") {
      node.declarations.forEach((declaration) => {
        if (
          declaration.id.type === "Identifier" &&
          declaration.init &&
          (declaration.init.type === "ObjectExpression" ||
            declaration.init.type === "ArrayExpression")
        ) {
          extractedObject.object = declaration.init;
          extractedObject.varName = declaration.id.name;
        }
      });
    }
  });

  return extractedObject;
}

export { extractObjectFromCode };
