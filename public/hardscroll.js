(function() {
    const config = {
        callUrl: 'https://stage-ade-an.hydro.online',
        eventURl: 'https://stage-events-an.hydro.online',
        encryptionKey: 'u8vB3tY5wQz9LmNp4RfXc2PkSjVh6DnO',
        tagValidationUrl: 'https://stage-ad-traffic-regulation-config.hydro.online/tags.json',
        countryValidationUrl: 'https://stage-ad-traffic-regulation-config.hydro.online/regulate.json',
        useEncryption: false
    };
    const urlParams = new URLSearchParams(document.currentScript.src.split('?')[1]);
    const countryCodeFromUrl = urlParams.get('country_code');
    let adSessionData = {
        hostname: window.location.hostname,
        adSessionId: null,
        adClicked: false,
        clickTimestamp: null,
        timeDelay: 5000,
        fetchBanner422Error: false,
        countryCode: countryCodeFromUrl,
        isCountryValid: null,
        countryValidated: false ,
        showAdOnTagID: null,
        tagRegulateDetailsAvailable: false
    };
   
    let tag_Id = window.Hydro_tagId;
    let adsId = '';
    let adSessionId = generateAdSessionId();
    let adContainer = null;
    let imageUrl, redirectUrl;
    let isAdClosed = false;
    let lastSentStatus = null;
    let alreadyShownAds = [];
    let adVisible = true;
    let isWaitingForNewAd = false;
    let isFetchingAd = false;
    let adClicked = false;
    let campID = '';
    let totalImages = 6;
    let scrollInterval = null;
    let isPageUnloading = false;
    let currentAdRequestId = null; // Store current request ID
    const encryptionUtils = {
        encrypt(data) {
            const textToChars = text => text.split('').map(c => c.charCodeAt(0));
            const keyChars = textToChars(config.encryptionKey);
            const keyLength = keyChars.length;
            const encryptedBytes = JSON.stringify(data).split('').map((char, index) => {
                return char.charCodeAt(0) ^ keyChars[index % keyLength];
            });
            const encryptedString = String.fromCharCode(...encryptedBytes);
            return btoa(encryptedString);
        },
        
        decrypt(encoded) {
            try {
                const encryptedString = atob(encoded);
                const keyChars = config.encryptionKey.split('').map(c => c.charCodeAt(0));
                const keyLength = keyChars.length;
                const decryptedBytes = encryptedString.split('').map((char, index) => {
                    return char.charCodeAt(0) ^ keyChars[index % keyLength];
                });
                const decryptedText = String.fromCharCode(...decryptedBytes);
                return JSON.parse(decryptedText);
            } catch (error) {
                console.error('Decryption error:', error);
                throw new Error('Decryption failed');
            }
        }
    };
    async function validateTagId() {
        if (adSessionData.tagRegulateDetailsAvailable) {
            return adSessionData.showAdOnTagID;
        }

        try {
            const response = await fetch(config.tagValidationUrl);
            if (!response.ok) {
                console.log('Failed to fetch tag validation data');
                adSessionData.showAdOnTagID = true;
           adSessionData.tagRegulateDetailsAvailable = true;
           saveAdSession();
           return true;
            }
            
            const data = await response.json();
            
            // Check if tag ID exists and if ads should be shown
            if (tag_Id && 
                data.tags && 
                data.tags[tag_Id]) {
                adSessionData.showAdOnTagID = data.tags[tag_Id].show_ad;
            } else {
                adSessionData.showAdOnTagID = true;
            }
            
            adSessionData.tagRegulateDetailsAvailable = true; // Mark as validated
            saveAdSession();
            return adSessionData.showAdOnTagID;
            
        } catch (error) {
            console.error('Error validating tag ID:', error);
            adSessionData.showAdOnTagID = true; 
            adSessionData.tagRegulateDetailsAvailable = true;
            saveAdSession();
            return false;
        }
    }
    async function validateCountry() {

        if (adSessionData.countryValidated) {
            return adSessionData.isCountryValid;
        }

        console.log('Validating country. Current country code:', adSessionData.countryCode);
        try {
            const response = await fetch(config.countryValidationUrl);
            if (!response.ok) {
                console.log('Failed to fetch country validation data');
                adSessionData.isCountryValid = false;
                adSessionData.countryValidated = true;
                saveAdSession();
                return false;
            }
            const data = await response.json();
            console.log('Validation data received:', data);
            
            if (adSessionData.countryCode && 
                data.countries && 
                data.countries[adSessionData.countryCode]) {
                adSessionData.isCountryValid = data.countries[adSessionData.countryCode].show_ad;
            } else {
                adSessionData.isCountryValid = false;
                console.log('Country not found in validation data or country code missing');
            }
            
            adSessionData.countryValidated = true;
            saveAdSession();
            return adSessionData.isCountryValid;
            
        } catch (error) {
            console.error('Error validating country:', error);
            adSessionData.isCountryValid = false;
            adSessionData.countryValidated = true;
            saveAdSession();
            return false;
        }
    }
    function preparePayload(payload) {
        if (config.useEncryption) {
            return { data: encryptionUtils.encrypt(payload) };
        }
        return payload;
    }
    
    function processResponse(response) {
        if (config.useEncryption) {
            return encryptionUtils.decrypt(response.data);
        }
        return response;
    }
    function generateAdSessionId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    // Modified initializeAdSession to handle page navigation within same domain
    function initializeAdSession() {
        const storedSession = sessionStorage.getItem('adSessionData');
        if (storedSession) {
            const parsedSession = JSON.parse(storedSession);
            if (parsedSession.hostname === window.location.hostname) {
                const sessionAge = Date.now() - (parsedSession.lastAccessed || 0);
                adSessionData = parsedSession;
                adSessionData.lastAccessed = Date.now();
                adSessionId = adSessionData.adSessionId;
                adSessionData.countryCode = countryCodeFromUrl;
                saveAdSession();
            } else {
                resetAdSession();
            }
        } else {
            resetAdSession();
        }
    }
    function resetAdSession() {
        adSessionData = {
            hostname: window.location.hostname,
            adSessionId: generateAdSessionId(),
            adClicked: false,
            clickTimestamp: null,
            timeDelay: 5000,
            lastAccessed: Date.now(),
            fetchBanner422Error: false,
            countryCode: countryCodeFromUrl,
            isCountryValid: null,
            countryValidated: false  
        };
        adSessionId = adSessionData.adSessionId;
    saveAdSession();
}

    function saveAdSession() {
        sessionStorage.setItem('adSessionData', JSON.stringify(adSessionData));
    }

    function resetSessionId() {
        adSessionId = generateAdSessionId();
        adSessionData.adSessionId = adSessionId;
        saveAdSession();
    }

    function closeAdSession() {
        clearAd();
        alreadyShownAds = [];
        resetSessionId();
    }

    // Listen for beforeunload to detect page refresh/navigation
    window.addEventListener('beforeunload', () => {
        isPageUnloading = true;
    });

    // Modified visibility change handler
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (!isPageUnloading) {
                closeAdSession();
            }
        } else {
            if (isAdClosed && !isFetchingAd && !adClicked) {
                init();
            }
        }
    });

    // Modified focus/blur handlers
    window.addEventListener('focus', () => {
        if (!isPageUnloading && isAdClosed && !isFetchingAd && !adClicked) {
            init();
        }
    });

    window.addEventListener('blur', () => {
        if (!isPageUnloading && !isWaitingForNewAd) {
            if (!document.hidden && !adVisible && !adClicked) {
                closeAdSession();
            }
        }
    });

    // Send error report to backend
    function sendErrorReport(errorCode, errorMessage) {
        if (adSessionData.isCountryValid) {
            const payload = {
                ad_session_id: adSessionId,
                pot_session_id: window.session_id,
                ad_request_id: currentAdRequestId,
                ad_id: adsId,
                tag_id: tag_Id,
                campaign_id: campID,
                error_code: errorCode,
                error_message: errorMessage,
                request_timestamp: Math.floor(Date.now() / 1000) 
            };
    
            const processedPayload = preparePayload(payload);
    
            fetch(config.eventURl + '/api/v1/ad-error', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify(processedPayload)
            }).then(response => response.json())
            .then(responseData => {
                const data = processResponse(responseData);
                console.log('Error report sent:', data);
            })
            .catch(error => console.error('Error sending error report:', error));
        } else {
            console.log('Error:', errorCode, errorMessage);
        }
    }

    // Modify getAdsId function to use the stored adSessionId
    async function getAdsId() {
        if (isFetchingAd) return;
        isFetchingAd = true;   
        try {
            currentAdRequestId = generateAdSessionId();
            if (adSessionData.isCountryValid) {
                // Use actual API calls when country is valid
                const payload = {
                    ad_session_id: adSessionData.adSessionId,
                    tag_id: tag_Id,
                    ad_request_id: currentAdRequestId,
                    impression_count: 6,
                    pot_session_id: window.session_id,
                    already_shown_ad_ids: alreadyShownAds.join(","),
                    country_code: adSessionData.countryCode,
                    request_timestamp: Math.floor(Date.now() / 1000) 
                };

                const processedPayload = preparePayload(payload);
                const response = await fetch(config.callUrl + '/api/v1/fetchbanner', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(processedPayload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    if (response.status === 422) {
                        adSessionData.fetchBanner422Error = true;
                        saveAdSession();
                        throw new Error(JSON.stringify(errorData));
                    } else {
                        throw new Error(JSON.stringify(errorData));
                    }
                }

                const responseData = await response.json();
                const data = processResponse(responseData);
                if (data.reset_ad === true) {
                    console.log('Resetting already shown ads array');
                    alreadyShownAds = [];
                }
                adsId = data.AdInfo.ad_id;
                imageUrl = data.AdInfo.ad_creative_url;
                redirectUrl = data.AdInfo.redirect_url;
                campID = data.AdInfo.campaign_id;

                if (!imageUrl) throw new Error('Image URL not received');
            } else {
                // Use hardcoded values when country is not valid
                adsId = "test_ad_123";
                imageUrl = "https://stage-creativestore-an.hydro.online/hydro-banner.png";
                const tagRedirectMap = {
                    '3a83c2d5-045e-4f4e-aa9c-0b9013411e02': 'https://www.linkedin.com/company/hydro-on-line/',
                    'd5d2d904-0c24-4925-ad20-91889672be9d': 'https://www.youtube.com/'
                };

                if (tag_Id in tagRedirectMap) {
                    redirectUrl = tagRedirectMap[tag_Id];
                } else {
                    redirectUrl = "https://bit.ly/t-hydro";
                }
                campID = "test_campaign_456";
            }

            alreadyShownAds.push(adsId);
            return { adsId, imageUrl, redirectUrl };
        } catch (error) {
            console.error('Error getting ad data:', error);
            if (adSessionData.isCountryValid) {
                sendErrorReport('FETCH_AD_NEW_SESSION', error.message);
            }
            throw error;
        } finally {
            isFetchingAd = false;
        }
    }

    // Create ad container dynamically
function createAdContainer() {
    adContainer = document.createElement('div');
    const screenWidth = window.innerWidth;
    
    let containerHeight, bottomPosition;
    if (screenWidth < 576) { // Mobile
        containerHeight = '105px';
        bottomPosition = '1%';
    } else if (screenWidth < 1025) { // Tablet
        containerHeight = '216px';
        bottomPosition = '2%';
    } else if (screenWidth < 1955){ // Desktop
        containerHeight = '163px';
        bottomPosition = '1%';
    } else {
        containerHeight = '220px';
        bottomPosition = '1%';
        }

    Object.assign(adContainer.style, {
        position: 'fixed',
        bottom: bottomPosition,
        left: '0',
        width: '96%',
        height: containerHeight,
        zIndex: '2147483647',
        overflow: 'hidden',
         marginLeft: '2%'
    });
    document.body.appendChild(adContainer);
}

    // Display banner ad
    function displayBanner() {
        if (!imageUrl || !adContainer) return;
        adContainer.innerHTML = '';
        adContainer.style.display = 'none'; // Hide container initially
        
        const scrollWrapper = document.createElement('div');
        Object.assign(scrollWrapper.style, {
            whiteSpace: 'nowrap',
            position: 'absolute',
            alignItems: 'center',
            transform: `translateX(${window.innerWidth}px)` // Start at window width
        });
        const getResponsiveImageUrl = () => {
            const screenWidth = window.innerWidth;
    if (adSessionData.isCountryValid) {
        // Construct URLs for different resolutions
          if (screenWidth < 576) {
            scrollDuration = 10000;
            return `${imageUrl}/mobile.gif`;
        } else if (screenWidth < 1100) {
            scrollDuration = 10000;
            return `${imageUrl}/tablet.gif`;
        } else if (screenWidth < 1955) {
            scrollDuration = 20000;
            return `${imageUrl}/desktop.gif`;
        } else {
            scrollDuration = 20000;
            return `${imageUrl}/large.gif`;
        }
    } else {
        // Use hardcoded URLs for invalid country case
        if (screenWidth < 576) {
            scrollDuration = 10000;
            return 'https://stage-creativestore-an.hydro.online/hydro-banner-mobile-1.png';
        } else if (screenWidth < 1100) {
            scrollDuration = 10000; 
            return 'https://stage-creativestore-an.hydro.online/hydro-banner-tablet.png';
        }
        scrollDuration = 20000;
        return 'https://stage-creativestore-an.hydro.online/hydro-banner-desktop.png';
    }
};
        // Create all images first
        const responsiveImageUrl = getResponsiveImageUrl();
        const totalImages = 6;
     
        const images = [];
    for (let i = 0; i < totalImages; i++) {
        const img = document.createElement('img');  
        Object.assign(img.style, {
            width: '100%',
            borderRadius: '14px',
            marginRight: '20px',
            cursor: 'pointer',
            display: 'inline-block'        
        });
        img.src = responsiveImageUrl;
        images.push(img);
        scrollWrapper.appendChild(img);
    }

    adContainer.appendChild(scrollWrapper);
    isAdClosed = false;

    Promise.all(images.map(img => {
        return new Promise((resolve) => {
            if (img.complete) {
                resolve();
            } else {
                img.onload = () => resolve();
                img.onerror = () => resolve();
            }
        });
    })).then(() => {
        // Only now show the container and set up everything
        adContainer.style.display = 'block';
        
        images.forEach((img, index) => {
            img.endEventSent = false;
            img.onclick = () => handleAdClick(img, redirectUrl);
                
                       const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !img.startEventSent) {
                        img.startEventSent = true;
                        sendStatus('start');
                        
                        const checkMiddlePosition = () => {
                            const rect = img.getBoundingClientRect();
                            const windowWidth = window.innerWidth;
                            const imageCenter = rect.left + (rect.width / 2);
                            
                            if (imageCenter <= windowWidth/2 && !img.midEventSent) {
                                img.midEventSent = true;
                                sendStatus('middle');
                                cancelAnimationFrame(img.rafId);
                            }
                            
                            if (!img.midEventSent) {
                                img.rafId = requestAnimationFrame(checkMiddlePosition);
                            }
                        };
                        checkMiddlePosition();
                    }
                    
                    if (!entry.isIntersecting && img.startEventSent && img.midEventSent && !img.endEventSent) {
                        img.endEventSent = true;
                        sendStatus('end');
                    }
                });
            }, { threshold: [0] });
           
            observer.observe(img);
        });
        const singleImageWidth = images[0].offsetWidth;
        startScrolling(scrollWrapper, singleImageWidth);
    });
}

    function handleAdClick(img, currentRedirectUrl) {
        adSessionData.adClicked = true;
        adSessionData.clickTimestamp = Date.now();
        saveAdSession();
        sendClickStatus();
        closeAd();
        window.open(currentRedirectUrl, '_blank');
    }

    function shouldShowAd() {
        if (!adSessionData.adClicked) return true;
        const elapsedTime = Date.now() - adSessionData.clickTimestamp;
        return elapsedTime >= adSessionData.timeDelay;
    }

    async function sendClickStatus() {
        if (adSessionData.isCountryValid) {
            try {
                const payload = {
                    ad_session_id: adSessionId,
                    ad_id: adsId,
                    pot_session_id: window.session_id,
                    ad_request_id: currentAdRequestId,
                    campaign_id: campID,
                    tag_id: tag_Id,
                    redirect_url: redirectUrl,
                    request_timestamp: Math.floor(Date.now() / 1000) 
                };

                const processedPayload = preparePayload(payload);

                const response = await fetch(config.eventURl + '/api/v1/ad-click', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(processedPayload)
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(JSON.stringify(errorData));
                }

                const responseData = await response.json();
                const data = processResponse(responseData);
                console.log('Click status sent:', data);
            } catch (error) {
                sendErrorReport('CLICK_TRACK_ERROR', error.message);
            }
        } else {
            console.log('Click event logged');
        }
    }
    function startScrolling(element, singleImageWidth) {
        if (scrollInterval) {
            clearInterval(scrollInterval);
        }
    
        // Speed calculation for 10-second duration per image
        // 10 seconds for one image to complete its journey
        const totalDistance = window.innerWidth + singleImageWidth; // Distance from start appearing to completely disappearing
        const speed = totalDistance / scrollDuration; // pixels per millisecond
        
        let position = window.innerWidth;
        let lastTimestamp = 0;
        let animationComplete = false;
    
        function animate(timestamp) {
            if (!lastTimestamp) {
                lastTimestamp = timestamp;
                scrollInterval = requestAnimationFrame(animate);
                return;
            }
    
            const elapsed = timestamp - lastTimestamp;
            const pixelsToMove = speed * elapsed;
            position -= pixelsToMove;
            lastTimestamp = timestamp;
    
            // Check if animation should complete
            if (position <= -singleImageWidth * totalImages) {
                if (!animationComplete) {
                    animationComplete = true;
                    // Ensure last image is fully out of view
                    element.style.transform = `translateX(${-(singleImageWidth * totalImages + window.innerWidth)}px)`;
                    
                    // Force the end event for the last image
                    const lastImage = element.children[totalImages - 1];
                    if (lastImage && lastImage.startEventSent && lastImage.midEventSent && !lastImage.endEventSent) {
                        lastImage.endEventSent = true;
                        sendStatus('end');
                    }
    
                    // Wait for status to be sent before fetching new ad
                    setTimeout(() => {
                        fetchNewAd();
                    }, 200);
                    return;
                }
            }
    
            element.style.transform = `translateX(${position}px)`;
            
            if (!animationComplete) {
                scrollInterval = requestAnimationFrame(animate);
            }
        }
    
        scrollInterval = requestAnimationFrame(animate);
    }
    function clearAd() {
        if (adContainer) {
            adContainer.style.display = 'none';
            adContainer.innerHTML = '';
            isAdClosed = true;
            imageUrl = redirectUrl = adsId = '';
        }
        if (scrollInterval) {
            cancelAnimationFrame(scrollInterval);
            scrollInterval = null;
        }
    }

    function closeAd() {
        clearAd();
    }

    async function sendStatus(event) {
        if (!adsId || (event === lastSentStatus && event !== 'start' && event !== 'middle' && event !== 'end')) return;
        lastSentStatus = event;

        if (adSessionData.isCountryValid) {
            try {
                const payload = {
                    ad_session_id: adSessionId,
                    ad_id: adsId,
                    pot_session_id: window.session_id,
                    ad_request_id: currentAdRequestId,
                    ad_position: event,
                    campaign_id: campID,
                    tag_id: tag_Id,
                    request_timestamp: Math.floor(Date.now() / 1000) 
                };

                const processedPayload = preparePayload(payload);

                const response = await fetch(config.eventURl + '/api/v1/ad-display', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(processedPayload)
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(JSON.stringify(errorData));
                }

                const responseData = await response.json();
                const data = processResponse(responseData);
                console.log('Status sent:', data);
            } catch (error) {
                console.error('Error sending status:', error);
                sendErrorReport('DISPLAY_TRACK_ERROR', error.message);
            }
        } else {
            console.log('Status event:', event);
        }
    }

    async function fetchNewAd() {
        if (isFetchingAd) return;
        if (adClicked) {
            adClicked = false;
        }
        clearAd();
        try {
            await getAdsId();
            displayBanner();
            isWaitingForNewAd = false;
        } catch (error) {
            console.error('Error fetching new ad:', error);
            sendErrorReport('FETCH_AD_EXISTING_SESSION', error.message);
        }
    }

    async function init() {
        initializeAdSession();
        
        // First validate tag ID
        if (!adSessionData.tagRegulateDetailsAvailable) {
            const showAdOnTagID = await validateTagId();
            if (!showAdOnTagID) {
                console.log('Ads not allowed for this tag');
                return; // Stop here if tag is not valid
            }
        } else if (!adSessionData.showAdOnTagID) {
            console.log('Ads not allowed for this tag (using cached validation)');
            return; // Stop here if cached tag validation shows invalid
        }
    
        // Only proceed to country validation if tag is valid
        if (!adSessionData.countryValidated) {
            await validateCountry();
        }
    
        // Check for 422 error only when country is valid
        if (adSessionData.isCountryValid && adSessionData.fetchBanner422Error) {
            console.log('422 error previously received. No calls will be made until session ends.');
            return;
        }
    
        if (shouldShowAd()) {
            try {
                await getAdsId();
                createAdContainer();
                displayBanner();
            } catch (error) {
                console.error('Failed to initialize ad:', error);
            }
        }
    }
    init();
    setInterval(() => {
        if (adSessionData.adClicked && isAdClosed && !isFetchingAd) {
            const elapsedTime = Date.now() - adSessionData.clickTimestamp;
            if (elapsedTime >= adSessionData.timeDelay) {
                console.log('Time delay completed, reinitializing ad');
                adSessionData.adClicked = false;
                saveAdSession();
                init();
            }
        }
    }, 1000); // Check every 60 seconds
})();
