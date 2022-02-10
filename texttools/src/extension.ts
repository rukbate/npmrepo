import * as vscode from 'vscode';
import {runWrapByLengthCommand} from './modules/wrapByLength';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands
		.registerCommand('texttools.wrapDocumentByLength', runWrapByLengthCommand(false)));
	context.subscriptions.push(vscode.commands
		.registerCommand('texttools.wrapSelectionByLength', runWrapByLengthCommand(true)));
}

export function deactivate() {}
