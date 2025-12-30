# Change Log

All notable changes to the "ignition-flint" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

### Added
- **Perspective JSON Formatting**: New command to format Perspective view JSON files with decoded embedded scripts for better readability
- **Automatic Formatting on Save**: Optional configuration to automatically format Perspective JSON files when saving
- **Ignition Automation Tools Integration**: Added ignition-automation-tools as a git submodule with documentation for using the Selenium-based testing utilities
- Configuration option `ignitionFlint.formatPerspectiveJsonOnSave` to enable/disable automatic formatting

### Changed
- Enhanced documentation with instructions for using ignition-automation-tools
- Added example VS Code settings file for Python IntelliSense with ignition-automation-tools

### Technical
- New command: `ignition-flint.format-perspective-json` available in the editor context menu for JSON files
- Embedded Python scripts in transforms are now decoded from unicode escape sequences for better readability
- Added comprehensive documentation in `libs/README.md` for automation tools integration

## [0.0.1-SNAPSHOT]

- Initial release