import * as vscode from "vscode";
import { generateType } from "./utils/generateType";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.generateType",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const selection = editor.selection;
        if (!selection.isEmpty) {
          const selectedText = editor.document.getText(selection);

          const typeDeclaration = generateType(selectedText);

          if (typeDeclaration) {
            vscode.workspace
              .openTextDocument({
                content: typeDeclaration.join("\n \n"),
                language: "typescript",
              })
              .then((doc) => {
                vscode.window.showTextDocument(
                  {
                    ...doc,
                  },
                  {
                    viewColumn: vscode.ViewColumn.Beside,
                    preserveFocus: false,
                    preview: true,
                    selection: new vscode.Range(0, 0, doc.lineCount, 0),
                  }
                );
              });
          } else {
            vscode.window.showErrorMessage(
              "Error generating type declaration."
            );
          }
        } else {
          vscode.window.showErrorMessage("Please select a variable.");
        }
      } else {
        vscode.window.showErrorMessage("No active editor.");
      }
    }
  );

  context.subscriptions.push(disposable);
}
