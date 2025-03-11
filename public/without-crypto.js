// Encryption functions
function l() {
    return 'IhtnZ7'
  }
  function s() {
    return 'tSu3d9'
  }
  function ls(message, k) {
    return CryptoJS.AES.encrypt(message, k).toString();
  }
  function se() {
    return 'Kh8UrY'
  }
  function n() {
    return 'DnFaCP3IQa'
  }
  function k() {
    return 'ebx4Wi'
  }
  function ky() {
    return s() + se() + k() + l() + n()
  }
  
  // URL obfuscation functions
  function ing() {
    return 'ping';
  }
  function dro() {
    return 'hydro';
  }
  function pi() {
    return 'https://pre-prod-api';
  }
  function lin() {
    return 'online';
  }
  function ana() {
    return 'analytics';
  }
  function rl() {
    return pi() + '-' + ana() + '.' + dro();
  }
  function rlp() {
    return rl() + '.' + lin() + '/' + dro() + '-' + ing();
  }
  
  // External script URL obfuscation functions
  function dev() {
    return 'dev';
  }
  function ad() {
    return 'adjs';
  }
  function an() {
    return 'an';
  }
  function getExternalScriptUrl() {
    return 'https://' + dev() + '-' + ad() + '-' + an() + '.' + dro() + '.' + lin();
  }
  
  function ss() {
    return 'xxxxxxxx';
  }
  function sa() {
    return 'xxxx';
  }
  function sb() {
    return '4xxx'
  }
  function sc() {
    return 'yxxx'
  }
  function sd() {
    return 'xxxxxxxxxxxx'
  }
  
  let inactivityInterval
  let session_id = generateSessionId()
  let lastStatus = 1 // Track the last known status (1 for active, 0 for inactive)
  let focusTimeout
  let IframesFlag = false
  let pingStatus = 0
  let countryCode = null 
  
  // Load the external script only once when the page loads
  function loadExternalScriptWithParams(sessionId, countryCode) {
    let script = document.createElement('script');
    const url = new URL(getExternalScriptUrl());
    url.searchParams.set('session_id', sessionId);
    url.searchParams.set('country_code', countryCode);
    script.src = url.toString();
    script.onload = () => {
      window.externalScriptLoaded = true;
      console.log("External script loaded successfully with sessionId and countryCode");
    };
    document.head.appendChild(script);
  }
  
  function handleEvents() {
    window.addEventListener('focus', () => {
      clearTimeout(focusTimeout) // Clear previous timeout if any
      pingStatus = 1
      handleVisibilityChange(pingStatus)
      connectTab()
    })
  
    window.addEventListener('blur', () => {
      if (!IframesFlag) {
        pingStatus = 0
        handleVisibilityChange(pingStatus)
        disconnectTab()
        session_id = generateSessionId()
        updateSessionIdGlobally(session_id); // Update global session ID
      }
    })
  
    onPageLoad()
  }
  
  function handleVisibilityChange(status) {
    if (status !== lastStatus) {
      lastStatus = status
      sendStatusToAPI(status)
    }
  }
  
  function onInactivityTimeout() {
    if (!document.hidden && lastStatus === 1) {
      connectTab()
      sendStatusToAPI(1)
    }
  }
  
  function onPageLoad() {
    sendStatusToAPI(1)
    resetInactivityTimer()
  }
  
  document.addEventListener('visibilitychange', function () {
    if (document.hidden || document.visibilityState === 'hidden') {
      // Browser window is minimized
      if (pingStatus === 1) {
        pingStatus = 0
        sendStatusToAPI(pingStatus)
        disconnectTab()
        clearInterval(intervalId)
        intervalId = null
        session_id = generateSessionId()
        updateSessionIdGlobally(session_id); // Update global session ID
      }
    } else {
      // Browser window is restored
      sendStatusToAPI(1)
      connectTab()
    }
  })
  
  function sendStatusToAPI(status) {
    let tag_id = window.Hydro_tagId
    let curt = Date.now() // Add current timestamp
    let xhr = new XMLHttpRequest()
    let ar = rlp(); // Use obfuscated URL
    console.log("URL", ar);
    xhr.open('POST', ar, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          // Only parse and handle response if script hasn't been loaded yet
          if (!window.externalScriptLoaded) {
            try {
              const response = JSON.parse(xhr.responseText);
              if (response.country_code) {
                countryCode = response.country_code;
                loadExternalScriptWithParams(session_id, countryCode);
              }
            } catch (e) {
              console.error('Error parsing API response:', e);
            }
          }
        } else {
          disconnectTab()
          session_id = generateSessionId()
          updateSessionIdGlobally(session_id); // Update global session ID
        }
      }
    }
    
    // Encrypt the payload
    let p = ls(JSON.stringify({
      status,
      tag_id,
      session_id,
      t_stamp: curt // Add timestamp to payload
    }), ky());
    
    xhr.send(p)
    
    // At this point, the session ID is updated globally, so external script can access it
    updateSessionIdGlobally(session_id);
  }
  
  function updateSessionIdGlobally(newSessionId) {
    window.session_id = newSessionId;  // Update global session ID
  }
  
  function resetInactivityTimer() {
    clearInterval(inactivityInterval)
    inactivityInterval = setInterval(onInactivityTimeout, 15000) // 15 seconds
  }
  
  function generateSessionId() {
    let d = ss() + '-' + sa() + '-' + sb() + '-' + sc() + '-' + sd();
    return d.replace(/[xy]/g, function (c) {
      let r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
  
  let broadcastChannel
  
  function connectTab() {
    if (!broadcastChannel) {
      broadcastChannel = new BroadcastChannel('tabCommunicationChannel')
      broadcastChannel.onmessage = onMessage
    }
  }
  
  function disconnectTab() {
    if (broadcastChannel) {
      broadcastChannel.postMessage('disconnect')
      broadcastChannel.close()
      broadcastChannel = null
    }
  }
  
  function onMessage(event) {
    if (event.data === 'disconnect') {
      disconnectTab()
    }
  }
  
  handleEvents()
  
  document.addEventListener('DOMContentLoaded', (event) => {
    addIframeListeners()
    observeDOMChanges()
  })
  
  let intervalId = null
  
  function addIframeListeners() {
    const iframes = document.querySelectorAll('iframe')
  
    if (iframes.length > 0) {
      iframes.forEach((iframe) => {
        if (!iframe.dataset.listenerAdded) {
          iframe.addEventListener('mouseenter', onIframeMouseEnter)
          iframe.addEventListener('mouseleave', onIframeMouseLeave)
          iframe.dataset.listenerAdded = true // Mark this iframe as having listeners added
        }
      })
    } else {
      console.log('iframe element not found')
    }
  }
  
  function onIframeMouseEnter() {
    IframesFlag = true
  }
  
  function onIframeMouseLeave() {
    IframesFlag = false
  }
  
  function observeDOMChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.target.childNodes.forEach((n) => {
          if (n.nodeName === 'IFRAME') {
            addIframeListeners()
          }
        })
      })
    })
  
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }