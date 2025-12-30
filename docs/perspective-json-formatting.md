# Perspective JSON Formatting Example

This document demonstrates the Perspective JSON formatting feature in Flint for Ignition.

## Problem

When working with Perspective view JSON files in Ignition 8.3, embedded Python scripts (like transforms) are stored with Unicode escape sequences, making them difficult to read:

```json
{
  "transforms": [
    {
      "code": "\tprefix_tag \u003d \"[default]Configuration/HistoryPrefix\"\n\tdesc_suffix \u003d \"/VisDesc\"\n\tunit_suffix \u003d \"/Performance/Parameters.Units\"\n\t# Update this suffix per transform (Bad/Good/Total)\n\tdata_suffix \u003d \"/Performance/Count/CountTotalShiftDay\" \n\t\n\tunit_map \u003d {\n\t    \"Rods\":    {\"axis\": \"Rods\",    \"plot\": 0},\n\t    \"Loops\":   {\"axis\": \"Loops\",   \"plot\": 1},\n\t    \"Loafs\":   {\"axis\": \"Loafs\",   \"plot\": 2}\n\t}\n\t\n\tread_paths \u003d [prefix_tag] + [\"{}{}\".format(p, desc_suffix) for p in value]\n\tresults \u003d system.tag.readBlocking(read_paths)\n\t\n\treturn results",
      "type": "script"
    }
  ]
}
```

Notice the `\u003d` for `=`, `\n` for newlines, `\t` for tabs - all on a single line!

## Solution

Use the **Format Perspective JSON** command to decode these scripts into a more readable format:

```json
{
  "transforms": [
    {
      "code": "\tprefix_tag = \"[default]Configuration/HistoryPrefix\"\n\tdesc_suffix = \"/VisDesc\"\n\tunit_suffix = \"/Performance/Parameters.Units\"\n\t# Update this suffix per transform (Bad/Good/Total)\n\tdata_suffix = \"/Performance/Count/CountTotalShiftDay\" \n\t\n\tunit_map = {\n\t    \"Rods\":    {\"axis\": \"Rods\",    \"plot\": 0},\n\t    \"Loops\":   {\"axis\": \"Loops\",   \"plot\": 1},\n\t    \"Loafs\":   {\"axis\": \"Loafs\",   \"plot\": 2}\n\t}\n\t\n\tread_paths = [prefix_tag] + [\"{}{}\".format(p, desc_suffix) for p in value]\n\tresults = system.tag.readBlocking(read_paths)\n\t\n\treturn results",
      "type": "script"
    }
  ]
}
```

Now the code uses standard escape sequences like `\n` and `\t` instead of Unicode escapes, making it much easier to read!

## How to Use

### Manual Formatting

1. Open a Perspective view JSON file
2. Right-click in the editor
3. Select **Format Perspective JSON**

### Automatic Formatting on Save

Add this to your VS Code settings (`.vscode/settings.json` or user settings):

```json
{
  "ignitionFlint.formatPerspectiveJsonOnSave": true
}
```

Now every time you save a Perspective view JSON file, it will be automatically formatted.

## Benefits

- **Easier to Read**: Decoded scripts are much easier to scan and understand
- **Better for Version Control**: Standard escape sequences create cleaner diffs
- **Improved Editing**: You can still use the existing script editing features, but the JSON itself is more maintainable
- **Works with Ignition 8.3**: Fully compatible with the filesystem-based project structure in Ignition 8.3

## Editing Scripts

While the formatted JSON is more readable, for complex script editing, you should still use the built-in script editing features:

1. Navigate to a `"code":` line in the JSON
2. Press `Ctrl+.` (or click the lightbulb icon)
3. Select **Edit Script Transform** (or appropriate script type)
4. Edit the script in a dedicated Python editor
5. Save to update the JSON

This gives you full Python syntax highlighting, IntelliSense, and other IDE features while editing.
