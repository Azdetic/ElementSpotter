# Privacy Policy for ElementSpotter

**Last Updated:** July 2026

ElementSpotter ("we", "our", or "the Extension") is committed to protecting your privacy. This Privacy Policy explains how your data is handled when you use the ElementSpotter Chrome Extension.

## 1. Data Collection
**We do not collect, transmit, distribute, or sell any of your personal data.** 
The Extension operates entirely locally on your device (browser). We do not use external servers, analytics trackers, or third-party APIs to gather information about you, your browsing history, or the elements you interact with.

## 2. Local Storage
The Extension uses the Chrome local storage API (`@plasmohq/storage`) solely to save your personal configuration preferences so they persist across browsing sessions. 
The following preferences are saved locally on your device:
- Extension toggle status (Active/Inactive)
- Selected Highlight Color
- Configured Hotkey (e.g., "Alt")
- Domain Filter Mode (Global vs. Specific)
- Your list of Whitelisted or Blacklisted domains

This data never leaves your device and is not accessible to the developers.

## 3. Clipboard Access
The Extension uses the Clipboard API exclusively to copy the HTML code of the elements you explicitly choose to spot and click. This copied data is stored temporarily in your system's clipboard and is not monitored, stored long-term, or transmitted anywhere by the Extension.

## 4. Required Permissions
The Extension requires the following permissions to function correctly:
- **`storage`**: Required to save your extension settings locally.
- **`<all_urls>` / `activeTab` / `tabs`**: Required to inject the overlay highlighter and listen for the hotkey on the websites you visit, as well as to determine the current domain for your whitelist/blacklist rules.

## 5. Changes to this Privacy Policy
We may update this Privacy Policy from time to time. If any significant changes are made that affect how we handle data, we will update the "Last Updated" date at the top of this policy.

## 6. Contact Us
If you have any questions or concerns about this Privacy Policy, please contact us by opening an issue on our GitHub repository:
https://github.com/Azdetic/ElementSpotter/issues
