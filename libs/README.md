# Ignition Automation Tools Integration

This directory contains the [ignition-automation-tools](https://github.com/inductiveautomation/ignition-automation-tools) library as a git submodule. This library provides utilities for automated testing of Ignition Perspective sessions using Selenium.

## Features

The ignition-automation-tools library includes:

- **Components**: Near 1:1 collection of Perspective components for testing
- **Helpers**: Specialized utilities for Selenium, Perspective components, and standardized assertions
- **Pages**: Page objects to use as parent classes for test automation

## Usage

To use these tools in your Ignition projects:

1. **Ensure the submodule is initialized:**
   ```bash
   git submodule update --init --recursive
   ```

2. **Install Python dependencies:**
   ```bash
   cd libs/ignition-automation-tools
   pip install -r requirements.txt
   ```

3. **Add to your Python path:**
   You can import the helpers in your Python test scripts:
   ```python
   import sys
   sys.path.append('libs/ignition-automation-tools')
   
   from Helpers.IAAssert import IAAssert
   from Helpers.IASelenium import IASelenium
   ```

4. **Use in VS Code:**
   Add the following to your `.vscode/settings.json` to get IntelliSense support:
   ```json
   {
     "python.analysis.extraPaths": [
       "${workspaceFolder}/libs/ignition-automation-tools"
     ]
   }
   ```

## Available Helpers

### IASelenium
Specialized handling of common Selenium interactions within Perspective.

### IAAssert
A standardized way to assert conditions throughout your testing framework.

### Perspective Page Helpers
- LoginHelper: Handle Perspective login interactions
- PopupHelper: Manage Perspective popup interactions
- DockedViewHelper: Work with docked views
- QualityOverlayHelper: Handle quality overlays
- NotificationHelper: Manage notifications

### Ignition Helpers
- Tag: Work with Ignition tags
- Alarm: Handle alarms
- AlarmEvent: Manage alarm events
- QualifiedValue: Work with qualified values

## Documentation

For more information, see the [official documentation](https://github.com/inductiveautomation/ignition-automation-tools).

## Support

This library is NOT supported as part of any Inductive Automation support plan. For questions, visit the [Inductive Automation forums](https://forum.inductiveautomation.com/c/automated-testing/).
