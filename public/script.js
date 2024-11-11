let inactivityInterval
let session_id = generateSessionId() // Initial session ID generation
let lastStatus = 1 // Track the last known status (1 for active, 0 for inactive)
let focusTimeout
let IframesFlag = false
let pingStatus = 0

// Load the external script only once when the page loads
function loadExternalScriptWithSessionId(sessionId) {
  // Check if the script is already loaded
  if (!window.externalScriptLoaded) {
    let script = document.createElement('script');
    script.src = `ad-script.js?session_id=${sessionId}`;
    script.onload = () => {
      window.externalScriptLoaded = true; // Mark the script as loaded
      console.log("External script loaded successfully");
    };
    document.head.appendChild(script);  // Appending to head to load the script
  }
}

function handleEvents() {
  window.addEventListener('focus', () => {
    clearTimeout(focusTimeout); // Clear previous timeout if any
    pingStatus = 1;
    handleVisibilityChange(pingStatus);
    connectTab();
  });

  window.addEventListener('blur', () => {
    if (!IframesFlag) {
      pingStatus = 0;
      handleVisibilityChange(pingStatus);
      disconnectTab();
      session_id = generateSessionId(); // Update session ID on blur
      updateSessionIdGlobally(session_id); // Update global session ID
    }
  });

  onPageLoad();
}

function handleVisibilityChange(status) {
  if (status !== lastStatus) {
    lastStatus = status;
    sendStatusToAPI(status);
  }
}

function onInactivityTimeout() {
  if (!document.hidden && lastStatus === 1) {
    connectTab();
    sendStatusToAPI(1);
  }
}

function onPageLoad() {
  sendStatusToAPI(1);
  resetInactivityTimer();

  // Load the external script with the initial session ID
  loadExternalScriptWithSessionId(session_id);
}

document.addEventListener('visibilitychange', function () {
  if (document.hidden || document.visibilityState === 'hidden') {
    // Browser window is minimized
    if (pingStatus === 1) {
      pingStatus = 0;
      sendStatusToAPI(pingStatus);
      disconnectTab();
      clearInterval(intervalId);
      intervalId = null;
      session_id = generateSessionId(); // Update session ID
      updateSessionIdGlobally(session_id); // Update global session ID
    }
  } else {
    // Browser window is restored
    sendStatusToAPI(1);
    connectTab();
  }
});

function sendStatusToAPI(status) {
  let tag_id = window.Hydro_tagId;
  let xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://api-analytics.hydro.online/hydro-ping', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        console.log('API response: coming', xhr.responseText);
      } else {
        disconnectTab();
        session_id = generateSessionId(); // Update session ID on failure
        updateSessionIdGlobally(session_id); // Update global session ID
      }
    }
  };
  xhr.send(
    JSON.stringify({
      status,
      tag_id,
      session_id,
    })
  );

  // At this point, the session ID is updated globally, so external script can access it
  updateSessionIdGlobally(session_id);
}

function updateSessionIdGlobally(newSessionId) {
  // Store the latest session ID globally
  window.session_id = newSessionId;  // Update global session ID

  // If you want the external script to access the updated session ID dynamically,
  // you can add custom logic here to notify the external script or just rely on window.session_id
}

function resetInactivityTimer() {
  clearInterval(inactivityInterval);
  inactivityInterval = setInterval(onInactivityTimeout, 15000); // 15 seconds
}

function generateSessionId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

let broadcastChannel;

function connectTab() {
  if (!broadcastChannel) {
    broadcastChannel = new BroadcastChannel('tabCommunicationChannel');
    broadcastChannel.onmessage = onMessage;
  }
}

function disconnectTab() {
  if (broadcastChannel) {
    broadcastChannel.postMessage('disconnect');
    broadcastChannel.close();
    broadcastChannel = null;
  }
}

function onMessage(event) {
  if (event.data === 'disconnect') {
    disconnectTab();
  }
}

handleEvents();

document.addEventListener('DOMContentLoaded', (event) => {
  addIframeListeners();
  observeDOMChanges();
});

let intervalId = null;

function addIframeListeners() {
  const iframes = document.querySelectorAll('iframe');

  if (iframes.length > 0) {
    iframes.forEach((iframe) => {
      if (!iframe.dataset.listenerAdded) {
        iframe.addEventListener('mouseenter', onIframeMouseEnter);
        iframe.addEventListener('mouseleave', onIframeMouseLeave);
        iframe.dataset.listenerAdded = true; // Mark this iframe as having listeners added
      }
    });
  } else {
    console.log('iframe element not found');
  }
}

function onIframeMouseEnter() {
  IframesFlag = true;
}

function onIframeMouseLeave() {
  IframesFlag = false;
}

function observeDOMChanges() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.target.childNodes.forEach((n) => {
        if (n.nodeName === 'IFRAME') {
          addIframeListeners();
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
