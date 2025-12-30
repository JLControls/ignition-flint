import * as vscode from 'vscode';
import { createLineNumberToSymbolPathMapping } from '../encodedScriptEditing/documentParsing';
import { SubscriptionManager } from '../utils/subscriptionManager';
import { throttle } from '../utils/throttle';
import { DependencyContainer } from '../dependencyContainer';
import { updateEditedCode } from '../encodedScriptEditing/documentEditing';
import { formatPerspectiveJson, isPerspectiveViewJson } from '../commands/formatPerspectiveJson';

const parsedJsonDocuments: Map<vscode.Uri, Map<number, string>> = new Map();

export function registerTextDocumentHandlers(context: vscode.ExtensionContext, subscriptionManager: SubscriptionManager, dependencyContainer: DependencyContainer) {
	subscriptionManager.add(vscode.workspace.onDidOpenTextDocument((document) => {
		if (document.languageId === 'json') {
			createLineNumberToSymbolPathMapping(document);
		}
	}));

	const throttledCreateLineNumberToSymbolPathMapping = throttle(createLineNumberToSymbolPathMapping, 500);

	subscriptionManager.add(vscode.workspace.onDidChangeTextDocument((event) => {
		if (event.document.languageId === 'json') {
			throttledCreateLineNumberToSymbolPathMapping(event.document);
		}
	}));

	subscriptionManager.add(vscode.workspace.onDidCloseTextDocument((document) => {
		if (document.languageId === 'json') {
			parsedJsonDocuments.delete(document.uri);
		}
	}));

	subscriptionManager.add(vscode.workspace.onDidSaveTextDocument(async (document) => {
		if (document.languageId === 'python') {
			const fileSystemService = dependencyContainer.getFileSystemService();
			const currentProject = fileSystemService.ignitionFileSystemProvider.getCurrentProjectResource(document.uri);
			if (currentProject) {
				await fileSystemService.ignitionFileSystemProvider.updateProjectInheritanceContext(currentProject);

				await fileSystemService.ignitionFileSystemProvider.triggerGatewayUpdatesForProjectPath(currentProject.relativePath);
			}
		} 

		if (document.uri.scheme === 'flint') {
			await updateEditedCode(document);
		}

		// Format perspective JSON files on save if enabled
		const formatOnSave = vscode.workspace.getConfiguration('ignitionFlint').get('formatPerspectiveJsonOnSave', false);
		if (formatOnSave && document.languageId === 'json' && isPerspectiveViewJson(document)) {
			try {
				const text = document.getText();
				const formatted = formatPerspectiveJson(text);
				
				if (formatted !== text) {
					const edit = new vscode.WorkspaceEdit();
					const fullRange = new vscode.Range(
						document.positionAt(0),
						document.positionAt(text.length)
					);
					edit.replace(document.uri, fullRange, formatted);
					await vscode.workspace.applyEdit(edit);
					// Save again after formatting
					await document.save();
				}
			} catch (error) {
				// Silently ignore formatting errors
				dependencyContainer.getOutputChannel().appendLine(`Failed to format perspective JSON: ${error}`);
			}
		}
	}));
}