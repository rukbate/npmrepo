import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let slice = (str: string, len: number) => {
		let pos = 0;
		let res = [];
		while(pos < str.length) {
			if(pos + len < str.length) {
				res.push(str.slice(pos, pos + len));
			} else {
				res.push(str.slice(pos));
			}

			pos += len;
		}
		return res;
	};

	let disposable = vscode.commands.registerCommand('texttools.wrapToLength', async () => {
		let lenStr = await vscode.window.showInputBox({
			prompt: 'Length per line',
			value: '80'
		});

		let len = Number(lenStr);
		if(!Number.isInteger(len) || len <= 0) {
			vscode.window.showErrorMessage('Invalid length');
			return;
		}
		
		const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
			//const selection = editor.selection;
			let invalidRange = new vscode.Range(0, 0, document.lineCount, 0);
			let fullRange = document.validateRange(invalidRange);
			
			const word = document.getText();
			const wrapped = slice(word, len).join('\n');
			editor.edit(editBuilder => {
				editBuilder.replace(fullRange, wrapped);
			}); 
        }
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
