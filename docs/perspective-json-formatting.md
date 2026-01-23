# Perspective JSON Formatting Example

This document demonstrates the Perspective JSON viewing feature in Flint for Ignition.

## Problem

When working with Perspective view JSON files in Ignition 8.3, embedded Python scripts (like transforms) are stored with escape sequences, making them difficult to read directly in the JSON file:

```json
{
  "transforms": [
    {
      "code": "\tprefix_tag = \"[default]Configuration/HistoryPrefix\"\n\tdesc_suffix = \"/VisDesc\"\n\tunit_suffix = \"/Performance/Parameters.Units\"\n\t# Update this suffix per transform\n\tdata_suffix = \"/Performance/Count/CountTotalShiftDay\"",
      "type": "script"
    }
  ]
}
```

Notice the `\n` for newlines and `\t` for tabs - all on a single line in the JSON!

## Solution

Use the **View Perspective JSON (Rendered)** command to open a rendered view where the escape sequences are displayed as actual newlines and tabs, without modifying the original file.

**How it works:**
1. The original JSON file remains unchanged on disk
2. A new editor tab opens showing a "rendered" version
3. The rendered view decodes escape sequences for display only
4. You can still use the existing script editing features for making changes

## How to Use

### View Rendered Perspective JSON

1. Open a Perspective view JSON file
2. Right-click in the editor
3. Select **View Perspective JSON (Rendered)**
4. A new editor tab opens beside your original showing the decoded view

The rendered view will show the Python code with proper formatting:
- `\n` displayed as actual line breaks
- `\t` displayed as proper indentation
- Unicode escapes like `\u003d` decoded to `=`

## Benefits

- **Non-destructive**: Original files are never modified
- **Easy to Read**: Escape sequences are rendered as formatting
- **Safe for Version Control**: No accidental file changes
- **Works with Existing Tools**: Still use the script editing features to make changes
- **Ignition 8.3 Compatible**: Works seamlessly with filesystem-based projects

## Editing Scripts

For editing scripts, continue to use the built-in script editing features:

1. In the **original** JSON file, navigate to a `"code":` line
2. Press `Ctrl+.` (or click the lightbulb icon)
3. Select **Edit Script Transform** (or appropriate script type)
4. Edit the script in a dedicated Python editor with full IDE features
5. Save to update the JSON

The rendered view is for **viewing only** - use the script editor for making changes.

## Example

**Original JSON file (with escape sequences):**
```json
"code": "\tvalue = system.tag.read(\"[default]MyTag\")\n\treturn value * 2"
```

**Rendered view (escape sequences displayed as formatting):**
```
"code": "	value = system.tag.read(\"[default]MyTag\")
	return value * 2"
```

The rendered view makes it much easier to understand the script logic at a glance!
