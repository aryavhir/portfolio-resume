(function() {
    const config = {
      tagId: 'sampleTagId123',
      redirectUrl: 'https://example.com/redirect-page',
      firstStatusTime: 5000,  // 5 seconds in milliseconds
      secondStatusTime: 60000,
      pollingInterval: 120000,
  };

let adsId = ''; // To store the ads ID after getting from /slots
let addRequestId = generateSessionId(); // Generate session ID at the start
let adElement = null;
let pollingTimeoutId = null;
// Function to generate a unique session ID
function generateSessionId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Function to send the Tag ID to the /slots endpoint and get the ads ID
function getAdsId() {
    return fetch('/slots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            tag_id: window.Hydro_tagId,
            add_request_id: addRequestId // Include session_id in the request
        })
    })
    .then(response => response.json())
    .then(data => {
        adsId = data.ad_id;
        imageUrl = data.ad_url 
        if (!imageUrl) {
          throw new Error('Image URL not received from ');
      }
  })
  .catch(error => {
      console.error('Error getting image URL:', error);
  });
}
function pollForNewAd() {
  getAdsId()
      .then(({ adsId: newAdsId, imageUrl: newImageUrl }) => {
          if (newAdsId !== adsId || newImageUrl !== imageUrl) {
              adsId = newAdsId;
              imageUrl = newImageUrl;
              updateAdDisplay();
          }
      })
      .catch(error => {
          console.error('Error polling for new ad:', error);
      })
      .finally(() => {
          // Schedule the next poll
          pollingTimeoutId = setTimeout(pollForNewAd, config.pollingInterval);
      });
}
// Function to send status to a specific endpoint
function sendStatus(event) {
      if (!adsId) {
          console.error('Ads ID not set. Cannot send status.');
          return;
      }
      fetch('/status', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              ads_id: adsId,
              status: event,
              add_request_id: addRequestId
          })
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          console.log('Status sent successfully:', data);
      })
      .catch(error => {
          console.error('Error sending status:', error);
      });
  }

// Function to display a JPEG at the bottom of the page
function displayImage() {
  if (!imageUrl) {
      console.error('Image URL not set. Cannot display image.');
      return;
  }
  if (!adElement) {
      adElement = document.createElement('img');
      adElement.style.position = 'fixed';
      adElement.style.bottom = '1%';
      adElement.style.left = '4%';
      adElement.style.right = '4%';
      adElement.style.zIndex = '1000';
      adElement.style.width = '92%';
      adElement.style.height = '15%';
      adElement.style.cursor = 'pointer';
      adElement.style.borderRadius = '14px';
      adElement.onclick = function() {
          sendStatus('click');
          closeAd();
          window.open(config.redirectUrl, '_blank');
      };
      document.body.appendChild(adElement);
  }
  adElement.src = imageUrl;
}

function updateAdDisplay() {
  if (adElement) {
      adElement.src = imageUrl;
  } else {
      displayImage();
  }
  sendStatus('display_start');
}
  function closeAd() {
      if (adElement && adElement.parentNode) {
          adElement.parentNode.removeChild(adElement);
      }
      sendStatus('ad_closed');
  }
// Main function to handle the display start, sending statuses, and image display
async function init() {
      try {
        await getAdsId();
      displayImage();
      sendStatus('display_start');

          setTimeout(() => {
              sendStatus('first_status_completed');
          }, config.firstStatusTime);

          setTimeout(() => {
              sendStatus('second_status_completed');
              closeAd();
            }, config.secondStatusTime);

// Start polling for new ads
pollForNewAd();
      } catch (error) {
          console.error('Failed to initialize ad:', error);
      }
  }

  function loadExternalConfig() {
      if (window.adConfig) {
          Object.assign(config, window.adConfig);
      }
  }

  loadExternalConfig();
  init();
})();