import firebase from "firebase"

/**
 * Start the auth flow and authorizes to Firebase.
 * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
 */
export function startAuth(interactive, callback) {
    console.log('hello')
    // Request an OAuth token from the Chrome Identity API.
    chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
        if (chrome.runtime.lastError && !interactive) {
            console.log('It was not possible to get a token programmatically.');
        } else if(chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else if (token) {
            // Authorize Firebase with the OAuth Access Token.
            var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
            firebase.auth().signInAndRetrieveDataWithCredential(credential).catch(function(error) {
                // The OAuth token might have been invalidated. Lets' remove it from cache.
                if (error.code === 'auth/invalid-credential') {
                    chrome.identity.removeCachedAuthToken({token: token}, function() {
                        startAuth(interactive);
                    });
                }
            });
        } else {
            console.error('The OAuth Token was null');
        }
    });
    console.log('here1')
    callback()
}

//{interactive: !!interactive}

/**
 * Starts the sign-in process.
 */
export function startSignIn(auth, callback) {
    auth.signOut();
    console.log('hello2')
    document.getElementById('quickstart-button').disabled = true;
    if (auth.currentUser) {
        console.log('currentUser')
        auth.signOut();
    } else {
        console.log('no user')
        startAuth(true, callback);
    }
}