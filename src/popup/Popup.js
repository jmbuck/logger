import {auth, googleAuth} from "../database/Auth.js";
import {once} from "../database/Database";
import {getWebsiteName} from "../background/Background";

var lastVisited;
var timeSpent;
var numberVisits;

/**
 * initApp handles setting up the Firebase context and registering
 * callbacks for the database status.
 *
 * The core initialization is in firebase.App - this is the glue class
 * which stores configuration. We provide an app name here to allow
 * distinguishing multiple app instances.
 *
 * This method also registers a listener with firebase.database().onAuthStateChanged.
 * This listener is called when the user is signed in or out, and that
 * is where we update the UI.
 *
 * When signed in, we also authenticate to the Firebase Realtime Database.js.
 */
function initApp() {

    //START SITE STATISTICS
    chrome.tabs.getSelected(null,function(tab) {
      var tabURL = tab.url;
    });

    var hostname = getWebsiteName(tabURL);
    var url = '/users/' + uid + '/websites/' + hostname + '/time';

    once(url, (snapshot) => {
        document.getElementById('quickstart-website-time-spent').textContent = snapshot;
    });
    //END SITE STATISTICS

    // Listen for database state changes.
    // [START authstatelistener]
    auth.onAuthStateChanged((user) => {
        console.log(user);
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            var hostname =
            // [START_EXCLUDE]
            document.getElementById("Stats").style.display = "block";
            document.getElementById("WelcomeMessage").style.display = "block";
            document.getElementById("SignInText").style.display = "none";
            document.getElementById("Hyperlink").style.display = "none";
            document.getElementById("UserID").style.display = "block";

            document.getElementById('quickstart-welcome-message').innerText = 'Hello ' + displayName + '!';
            document.getElementById('quickstart-userid').innerText = 'UserID: ' + uid;
            document.getElementById('quickstart-button-google').textContent = 'Sign out with Google';
            document.getElementById('quickstart-website-visits').textContent = 'undefined';
            document.getElementById('quickstart-website-time-spent').textContent = '';
            document.getElementById('quickstart-website-visit-count').textContent = 'undefined';

            // [END_EXCLUDE]
        } else {
            // Let's try to get a Google database token programmatically.
            // [START_EXCLUDE]
            document.getElementById("Stats").style.display = "none";
            document.getElementById("WelcomeMessage").style.display = "none";
            document.getElementById("SignInText").style.display = "block";
            document.getElementById("Hyperlink").style.display = "block";
            document.getElementById("UserID").style.display = "none";

            document.getElementById('quickstart-button-google').textContent = 'Sign in with Google';
            document.getElementById('quickstart-website-visits').textContent = 'Not Signed In';
            document.getElementById('quickstart-website-time-spent').textContent = 'Not Signed In';
            document.getElementById('quickstart-website-visit-count').textContent = 'Not Signed In';
            // [END_EXCLUDE]
        }
        document.getElementById('quickstart-button-google').disabled = false;
    });
    // [END authstatelistener]

    document.getElementById('quickstart-button-google').addEventListener('click', startSignIn, false);
}

/**
 * Start the database flow and authorizes to Firebase.
 * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
 */
function startAuth(interactive) {
    // Request an OAuth token from the Chrome Identity API.
    chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
        if (chrome.runtime.lastError && !interactive) {
            console.log('It was not possible to get a token programmatically.');
        } else if(chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else if (token) {
            // Authorize Firebase with the OAuth Access Token.
            var credential = googleAuth.credential(null, token);
            auth.signInAndRetrieveDataWithCredential(credential).catch(function(error) {
                // The OAuth token might have been invalidated. Lets' remove it from cache.
                if (error.code === 'database/invalid-credential') {
                    chrome.identity.removeCachedAuthToken({token: token}, function() {
                        startAuth(interactive);
                    });
                }
            });
        } else {
            console.error('The OAuth Token was null');
        }
    });
}

/**
 * Starts the sign-in process.
 */
function startSignIn() {
    document.getElementById('quickstart-button-google').disabled = true;
    if (auth.currentUser) {
       auth.signOut();
    } else {
        startAuth(true);
    }
}

window.onload = function() {
    initApp();
};
