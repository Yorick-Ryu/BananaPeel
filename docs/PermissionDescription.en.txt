Single-Purpose Description

This extension provides a core function: it allows users to send any image on a webpage to a specified AI server for background removal via the right-click context menu, and then download the processed image locally.

To balance data privacy and ease of use, this extension supports two server modes:
1.  **Local Server Mode:** Users can deploy their own AI server. In this mode, all image data is processed within the user's local environment, ensuring complete data privacy.
2.  **Cloud Server Mode:** For users to quickly experience the functionality, we also provide a public cloud processing server. Users can choose to send images to this server for processing.

The purpose of the extension is to provide users with a flexible and efficient AI image processing tool while giving them full control over their data privacy.

Reasons for Requesting Permissions

1.  `contextMenus`
    *   **Reason:** This permission is used to create a "Process Image with DeepShare" option in the context menu when a user right-clicks on an image on a webpage. This is the core interaction method of the extension, allowing users to conveniently select an image and start the processing flow.

2.  `activeTab`
    *   **Reason:** When a user selects an image for processing via the context menu, we need the `activeTab` permission to get context from the current active tab, specifically the URL of the image the user clicked on. This permission ensures that the extension only runs on the current page where the user has explicitly initiated an action.

3.  `scripting`
    *   **Reason:** This permission is used in conjunction with `activeTab`. After a user selects an image for processing, we need to inject a script into the current page to capture and pass the image URL to the background service. This is a key technical step in implementing the page-to-backend processing flow.

4.  `storage`
    *   **Reason:** This permission is used to store the extension's configuration settings locally, such as the user's selected server address (whether it's a local address or our provided cloud address) and the default AI model. This allows for user personalization and persistence of settings.

5.  `downloads`
    *   **Reason:** After the AI server (whether local or cloud) has finished processing the image, this permission is used to trigger the browser's download function to save the processed image to the user's computer.

6.  Host Permissions (`http://*/*`, `https://*/*` or more specific domains)
    *   **Reason:** This permission is required to allow the extension to communicate with the AI server. Since we support two modes, corresponding network access permissions are needed:
        *   **Accessing Local Server:** Allows the user to connect to their self-deployed server on the local network (e.g., `http://127.0.0.1:7001`) or a local area network.
        *   **Accessing Cloud Server:** Allows the user to connect to our public cloud server (e.g., `https://api.bp.rick216.cn`).
    *   Users can freely switch the server address in the extension's settings page. Granting this permission is necessary to enable the image sending and processing functionality. We promise that data will only be sent to the user-specified server address when a processing request is actively initiated by the user.
