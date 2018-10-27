# Logger
An extension that tracks internet usage.

## Client Setup
1. Run `npm install` or `yarn install` in the client folder of the project on your machine.
2. Start the development server with `npm start` or `yarn start`. Changes made to the source code will be immediately reflected in the React page on the development server.
3. All code for the popup portion of the extension and the JavaScript not related to the React page should be put in the public folder. Do not modify index.html, this is what React uses to render the main page.

## Deploying the extension
1. Run `yarn build`
2. Navigate to the Chrome extension menu and turn Developer mode on.
3. Select 'Load unpacked' and select the generated build folder in the project.
4. The extension should now be installed and usable. 
5. Changes to the code will not be reflected in the extension unless you repeat steps 1-4.


