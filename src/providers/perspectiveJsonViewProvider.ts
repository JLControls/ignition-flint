import * as vscode from 'vscode';
import { decodeCodeText } from '../utils/textEncoding';

/**
 * Custom TextDocumentContentProvider that renders Perspective JSON files
 * with decoded scripts (escape sequences rendered as actual newlines/tabs)
 * without modifying the underlying file.
 */
export class PerspectiveJsonContentProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    readonly onDidChange = this._onDidChange.event;

    /**
     * Provide the decoded/rendered content for a Perspective JSON file
     */
    provideTextDocumentContent(uri: vscode.Uri): string {
        // Get the original file URI from the query parameter
        const originalUri = vscode.Uri.parse(uri.query);
        
        // Find the original document
        const originalDocument = vscode.workspace.textDocuments.find(
            doc => doc.uri.toString() === originalUri.toString()
        );

        if (!originalDocument) {
            return 'Error: Could not find original document';
        }

        try {
            const originalText = originalDocument.getText();
            return this.renderPerspectiveJson(originalText);
        } catch (error) {
            return `Error rendering Perspective JSON: ${error}`;
        }
    }

    /**
     * Render a Perspective JSON string with decoded scripts for display
     */
    private renderPerspectiveJson(jsonText: string): string {
        try {
            const obj = JSON.parse(jsonText);
            this.decodeScriptsInObject(obj);
            return JSON.stringify(obj, this.scriptReplacer.bind(this), 2);
        } catch (error) {
            throw new Error(`Failed to parse JSON: ${error}`);
        }
    }

    /**
     * Custom JSON replacer that renders scripts with actual newlines and tabs
     */
    private scriptReplacer(key: string, value: any): any {
        if (key === 'code' && typeof value === 'string') {
            // The value is already decoded, now we need to format it for display
            // We'll add visual line breaks after actual newlines in the string
            const lines = value.split('\n');
            if (lines.length > 1) {
                // Multi-line code - format it nicely
                return '\n' + lines.map(line => '    ' + line).join('\n') + '\n  ';
            }
        }
        return value;
    }

    /**
     * Recursively find and decode script code in an object
     */
    private decodeScriptsInObject(obj: any): void {
        if (!obj || typeof obj !== 'object') {
            return;
        }

        if (Array.isArray(obj)) {
            obj.forEach(item => this.decodeScriptsInObject(item));
            return;
        }

        for (const key in obj) {
            if (key === 'code' && typeof obj[key] === 'string') {
                const value = obj[key];
                // Check if this looks like an encoded script with common Ignition escape patterns
                if ((value.includes('\\u003d') || value.includes('\\u003c') || value.includes('\\u003e') || 
                     value.includes('\\u0026') || value.includes('\\u0027')) ||
                    (value.includes('\\n') && value.includes('\\t'))) {
                    try {
                        obj[key] = decodeCodeText(value);
                    } catch (e) {
                        // If decoding fails, leave it as is
                    }
                }
            } else if (typeof obj[key] === 'object') {
                this.decodeScriptsInObject(obj[key]);
            }
        }
    }

    /**
     * Trigger a refresh of the rendered view
     */
    refresh(uri: vscode.Uri): void {
        this._onDidChange.fire(uri);
    }
}

/**
 * Command to open a Perspective JSON file in a rendered view
 */
export async function viewPerspectiveJsonCommand() {
    const editor = vscode.window.activeTextEditor;
    
    if (!editor) {
        vscode.window.showWarningMessage('No active editor found.');
        return;
    }

    const document = editor.document;
    
    if (document.languageId !== 'json') {
        vscode.window.showWarningMessage('This command only works with JSON files.');
        return;
    }

    // Check if it's a Perspective JSON file
    if (!isPerspectiveViewJson(document)) {
        vscode.window.showWarningMessage('This does not appear to be a Perspective view JSON file.');
        return;
    }

    // Create a URI for the rendered view
    const renderedUri = vscode.Uri.parse(
        `perspective-json-view:${document.fileName}?${document.uri.toString()}`
    );

    // Open the rendered view in a new editor column
    const doc = await vscode.workspace.openTextDocument(renderedUri);
    await vscode.window.showTextDocument(doc, {
        viewColumn: vscode.ViewColumn.Beside,
        preview: false,
        preserveFocus: false
    });
}

/**
 * Check if a document is a Perspective view JSON file
 */
export function isPerspectiveViewJson(document: vscode.TextDocument): boolean {
    if (document.languageId !== 'json') {
        return false;
    }

    const filePath = document.uri.fsPath.toLowerCase();
    
    // Check if the file is in a perspective directory structure
    const pathParts = filePath.split(/[/\\]/);
    const hasPerspective = pathParts.some(part => part === 'perspective');
    const hasView = pathParts.some(part => part === 'views' || part === 'view');
    const hasComponent = pathParts.some(part => part === 'components' || part === 'component');
    
    if (hasPerspective && (hasView || hasComponent)) {
        return true;
    }

    // Check the content for perspective-specific markers
    try {
        const text = document.getText();
        const obj = JSON.parse(text);
        
        // Look for typical Perspective view/component structure
        if (obj.custom || obj.root || (obj.params && obj.meta)) {
            return true;
        }
        
        // Check for transforms which are common in perspective views
        if (obj.props && hasTransforms(obj.props)) {
            return true;
        }
    } catch (error) {
        return false;
    }

    return false;
}

/**
 * Recursively check if an object has transforms
 */
function hasTransforms(obj: any): boolean {
    if (!obj || typeof obj !== 'object') {
        return false;
    }

    if (obj.transforms && Array.isArray(obj.transforms)) {
        return true;
    }

    for (const key in obj) {
        if (typeof obj[key] === 'object' && hasTransforms(obj[key])) {
            return true;
        }
    }

    return false;
}
