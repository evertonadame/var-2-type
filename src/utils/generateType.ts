import * as vscode from "vscode";
import * as esprima from "esprima";
import { extractObjectFromCode } from "./extractObject";
import objectToJson from "json-to-ts";

function getRootName(
  rootNameConfig: string | undefined,
  varName = "" as string
) {
  return rootNameConfig
    ? rootNameConfig.charAt(0).toUpperCase() + rootNameConfig.slice(1)
    : varName.charAt(0).toUpperCase() + varName?.slice?.(1);
}

function generateType(selectedText: string): string[] | undefined {
  const configuration = vscode.workspace.getConfiguration("varToType");
  const useTypeAlias = configuration.get<boolean>("useTypeAlias") ?? true;
  const rootNameConfig = configuration.get<string>("rootname") ?? "";
  let codeToType = {};
  let isArrayExpression = false;

  try {
    const valueToSend = JSON.parse(selectedText);

    if (valueToSend) {
      codeToType = valueToSend;
    }

    return objectToJson(codeToType, {
      rootName: "Root",
      useTypeAlias,
    });
  } catch (error) {}

  try {
    const { object: esprimaObject, varName } =
      extractObjectFromCode(selectedText);

    if (esprimaObject) {
      const objectCode = selectedText.substring(
        esprimaObject.range[0],
        esprimaObject.range[1]
      );

      codeToType = eval("(" + objectCode + ")");
      isArrayExpression = esprimaObject.type === "ArrayExpression";
    } else {
      throw new Error(
        "We dont think you need we to generate type for this variable as it is not an object. if you think it is an object, please raise an issue on github."
      );
    }

    const rootName = getRootName(rootNameConfig, varName ?? "");

    const options = {
      rootName,
      useTypeAlias,
    };

    const typeDeclaration = objectToJson(codeToType, options);

    if (isArrayExpression && useTypeAlias) {
      return typeDeclaration.map((type) => {
        const isRootType = type.includes(rootName);

        if (isRootType) {
          return type.concat("[]");
        }

        return type;
      });
    }
    return typeDeclaration;
  } catch (error) {
    const { message } = (error as Error) ?? {};

    return [`Message from varToType: ${message ?? ""}`];
  }
}

export { generateType };
