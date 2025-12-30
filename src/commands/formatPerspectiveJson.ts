import * as vscode from 'vscode';
import { decodeCodeText, encodeCodeText } from '../utils/textEncoding';

/**
 * Command to format Perspective view JSON files with decoded scripts for better readability
 */
export async function formatPerspectiveJsonCommand() {
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

    const text = document.getText();
    
    try {
        const formatted = formatPerspectiveJson(text);
        
        const edit = new vscode.WorkspaceEdit();
        const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(text.length)
        );
        edit.replace(document.uri, fullRange, formatted);
        
        await vscode.workspace.applyEdit(edit);
        vscode.window.showInformationMessage('Perspective JSON formatted successfully.');
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to format JSON: ${error}`);
    }
}

/**
 * Format a Perspective JSON string with decoded scripts
 */
export function formatPerspectiveJson(jsonText: string): string {
    try {
        const obj = JSON.parse(jsonText);
        decodeScriptsInObject(obj);
        return JSON.stringify(obj, null, 2);
    } catch (error) {
        throw new Error(`Failed to parse JSON: ${error}`);
    }
}

/**
 * Recursively find and decode script code in an object
 */
function decodeScriptsInObject(obj: any): void {
    if (!obj || typeof obj !== 'object') {
        return;
    }

    if (Array.isArray(obj)) {
        obj.forEach(item => decodeScriptsInObject(item));
        return;
    }

    for (const key in obj) {
        if (key === 'code' && typeof obj[key] === 'string') {
            // Check if this looks like an encoded script with common Ignition escape patterns
            const value = obj[key];
            // More specific check: look for common Ignition-specific unicode escapes or multiple escape sequences
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
            decodeScriptsInObject(obj[key]);
        }
    }
}

/**
 * Encode scripts in a JSON object
 */
export function encodePerspectiveJson(jsonText: string): string {
    try {
        const obj = JSON.parse(jsonText);
        encodeScriptsInObject(obj);
        return JSON.stringify(obj, null, 2);
    } catch (error) {
        throw new Error(`Failed to parse JSON: ${error}`);
    }
}

/**
 * Recursively find and encode script code in an object
 */
function encodeScriptsInObject(obj: any): void {
    if (!obj || typeof obj !== 'object') {
        return;
    }

    if (Array.isArray(obj)) {
        obj.forEach(item => encodeScriptsInObject(item));
        return;
    }

    for (const key in obj) {
        if (key === 'code' && typeof obj[key] === 'string') {
            // Encode the script
            try {
                obj[key] = encodeCodeText(obj[key]);
            } catch (e) {
                // If encoding fails, leave it as is
            }
        } else if (typeof obj[key] === 'object') {
            encodeScriptsInObject(obj[key]);
        }
    }
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
    // Use path separators to ensure we're matching directories, not just substrings
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
