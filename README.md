## Introduction
This is a oldschool style chat app that uses Microsoft Teams' platform.

*Note:* This is not finished.


## Things todo

[] - Implement window drag/move
[] - Implement minimize and hide function on window control bar
[] - Add MS Graph websocket for notifications
[] - Add general controls for application
[] - Add settings page
[] - Add error handling and action notifications/modals

## Quickstart
1.  Go to 'Azure Active Directory' > 'App registrations' and create a new registration
2.  When done go to 'Authentication'-tab, press ' + Add a platform' and add a single-page app. Use `http://localhost:3000/callback` as redirect URI
3. In the 'API permissions'-tab and add the following Microsoft Graph permissions:

 * Channel.ReadBasic.All 
 * Chat.Read 
 * User.Read 
 * ChannelMessage.Send

 4. Copy `.env.example` to `.env` and fill out the variables

 5. Run `pnpm start` / `npm start`. For application mode (WIP: install tauri first) run `pnpx tauri dev` /`npx tauri dev` after the previous command. Note: The application uses another URL than your default localhost. In order to be able to login, you need to add `https://tauri.localhost/callback` in Azure SPA platform registration.

 6. When the app is running, there is a button at the bottom corner to initiate login.