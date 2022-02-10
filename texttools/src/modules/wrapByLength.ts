import * as vscode from 'vscode';

export function runWrapByLengthCommand(selected: boolean) {
	return async () => {
		const cfgLen: string = vscode.workspace.getConfiguration("editor").get('wordWrapColumn') || '80';

		let lenStr = await vscode.window.showInputBox({
			prompt: 'Length per line',
			value: cfgLen
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