# Change Log

All notable changes to the "ignition-flint" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

### Added
- **Perspective JSON Rendered View**: New command to view Perspective view JSON files with embedded scripts rendered (escape sequences displayed as actual newlines/tabs) without modifying the original file
- **Ignition Automation Tools Integration**: Added ignition-automation-tools as a git submodule with documentation for using the Selenium-based testing utilities

### Changed
- Enhanced documentation with instructions for using ignition-automation-tools
- Added example VS Code settings file for Python IntelliSense with ignition-automation-tools

### Technical
- New command: `ignition-flint.view-perspective-json` available in the editor context menu for JSON files
- Custom TextDocumentContentProvider for rendering Perspective JSON with decoded scripts
- Embedded Python scripts in transforms are displayed with escape sequences rendered as formatting
- Added comprehensive documentation in `libs/README.md` for automation tools integration

## [0.0.1-SNAPSHOT]

- Initial release