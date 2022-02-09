import * as vscode from 'vscode';

function slice(text: string, len: number) {		
	let res = new Array();

	text.split('\n').forEach(str => {
		let pos = 0;
		while(pos < str.length) {
			res.push(str.slice(pos, Math.min(str.length, pos + len)));

			pos += len;
		}
	});
	
	return res;
};

function doWrap(selected: boolean) {
	return async () => {
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
			let region: vscode.Range | vscode.Selection;
			let word;

			if(selected) {
				region = editor.selection;
				word = document.getText(region);
			} else {
				let invalidRange = new vscode.Range(0, 0, document.lineCount, 0);
				region = document.validateRange(invalidRange);
				word = document.getText();
			}
						
			const wrapped = slice(word, len).join('\n');
			editor.edit(editBuilder => {
				editBuilder.replace(region, wrapped);
			}); 
        }
	};
}

export function activate(context: vscode.ExtensionContext) {
	let disposable1 = vscode.commands.registerCommand('texttools.wrapDocumentByLength', doWrap(false));
	let disposable2 = vscode.commands.registerCommand('texttools.wrapSelectionByLength', doWrap(true));

	context.subscriptions.push(disposable1);
	context.subscriptions.push(disposable2);
}

export function deactivate() {}
