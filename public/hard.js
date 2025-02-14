(function() {
    const config = {
        callUrl: 'https://dev-ade-an.hydro.online',
        eventURl: 'https://dev-events-an.hydro.online',
        encryptionKey: 'u8vB3tY5wQz9LmNp4RfXc2PkSjVh6DnO',
        tagValidationUrl: 'https://dev-ad-traffic-regulation-config.hydro.online/tags.json',
        countryValidationUrl: 'https://dev-ad-traffic-regulation-config.hydro.online/regulate.json',
        useEncryption: false,
        
    };
    const urlParams = new URLSearchParams(document.currentScript.src.split('?')[1]);
    const countryCodeFromUrl = urlParams.get('country_code');
    let adSessionData = {
        hostname: window.location.hostname,
        adSessionId: null,
        adClicked: false,
        clickTimestamp: null,
        timeDelay: 180000, 
        fetchBanner422Error: false,
        countryCode: countryCodeFromUrl,
        isCountryValid: null,
        countryValidated: false ,
        showAdOnTagID: null,
        tagRegulateDetailsAvailable: false
    };
   let HydroDefaultBannerPath = 'https:/dev-creativestore-an.hydro.online/ad_hydro_default';
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
    let isPageUnloading = false;
    let currentAdRequestId = null;
    let currentImpressionTimer = null; // Added this variable declaration
    let impressionCount = 0; // Added to track impressions globally
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
            timeDelay: 180000,
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
                imageUrl = "https://dev-creativestore-an.hydro.online/hydro-banner.png";
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
        if (screenWidth < 576) {
            containerHeight = '105px';
            bottomPosition = '1%';
        } else if (screenWidth < 1025) {
            containerHeight = '216px';
            bottomPosition = '2%';
        } else if (screenWidth < 1955) {
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
    
        // Base container setup with responsive dimensions
        const screenWidth = window.innerWidth;
        let containerHeight, containerWidth, bottomPosition;
        
        if (screenWidth < 576) {  // Mobile
            containerHeight = '105px';
            containerWidth = '96%';
            bottomPosition = '1%';
        } else if (screenWidth < 1025) {  // Tablet
            containerHeight = '216px';
            containerWidth = '96%';
            bottomPosition = '2%';
        } else if (screenWidth < 1955) {  // Desktop
            containerHeight = '163px';
            containerWidth = '96%';
            bottomPosition = '1%';
        } else {  // Large Desktop
            containerHeight = '220px';
            containerWidth = '96%';
            bottomPosition = '1%';
        }
    
        // Set container styles with flexible dimensions
        Object.assign(adContainer.style, {
            position: 'fixed',
            bottom: bottomPosition,
            left: '0',
            width: containerWidth,
            height: containerHeight,
            marginLeft: '2%',
            zIndex: '2147483647',
            transition: 'all 0.3s ease',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
        });
    
        const bannerWrapper = document.createElement('div');
        Object.assign(bannerWrapper.style, {
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'all 0.3s ease'
        });
    
        // Get responsive image URL
        const getResponsiveImageUrl = () => {
            if (adSessionData.isCountryValid) {
                if (screenWidth < 576) {
                    return `${imageUrl}/mobile.gif`;
                } else if (screenWidth < 1100) {
                    return `${imageUrl}/tablet.gif`;
                } else if (screenWidth < 1955) {
                    return `${imageUrl}/desktop.gif`;
                } else {
                    return `${imageUrl}/large.gif`;
                }
            }  else {
                if (screenWidth < 576) {
                    return `${HydroDefaultBannerPath}/mobile.gif`;
                } else if (screenWidth < 1100) {
                    return `${HydroDefaultBannerPath}/tablet.gif`;
                }
                return `${HydroDefaultBannerPath}/desktop.gif`;
            }
        };
    
        const img = document.createElement('img');
        Object.assign(img.style, {
            maxWidth: '100%',
            maxHeight: '100%',
            width: '100%',
            height: '100%',
            borderRadius: '14px',
            cursor: 'pointer',
            display: 'block',
            transition: 'all 0.3s ease',
            objectFit: 'contain'  // This ensures the image maintains its aspect ratio
        });
    
        img.src = getResponsiveImageUrl();
        img.onclick = () => handleAdClick(img, redirectUrl);
        
        bannerWrapper.appendChild(img);
        adContainer.appendChild(bannerWrapper);
        const handleResize = () => {
            const newScreenWidth = window.innerWidth;
            if (newScreenWidth !== screenWidth) {
                img.src = getResponsiveImageUrl();
                displayBanner(); // Re-initialize with new dimensions
            }
        };
    
        // Debounce resize handler for better performance
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 250);
        });
    
        bannerWrapper.appendChild(img);
        adContainer.appendChild(bannerWrapper);
        adContainer.style.display = 'block';
        isAdClosed = false;
        let impressionCount = 0;
        const IMPRESSION_INTERVAL = 5000; // 5 seconds
        const MAX_IMPRESSIONS = 6;

        new Promise((resolve) => {
            if (img.complete) {
                resolve();
            } else {
                img.onload = () => resolve();
                img.onerror = () => resolve();
            }
        }).then(() => {
            adContainer.style.display = 'block';
            
            if (currentImpressionTimer) {
                clearInterval(currentImpressionTimer);
            }
            
            // Set up timer for all impressions including the first one
            currentImpressionTimer = setInterval(() => {
                if (impressionCount < MAX_IMPRESSIONS) {
                    sendStatus('middle');
                    impressionCount++;
                    
                    // If this was the last impression, schedule the next ad fetch
                    if (impressionCount === MAX_IMPRESSIONS) {
                        clearInterval(currentImpressionTimer);
                        currentImpressionTimer = null;
                        setTimeout(() => {
                            fetchNewAd();
                        }, 200);
                    }
                }
            }, IMPRESSION_INTERVAL);
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
        if (currentImpressionTimer) {
            clearInterval(currentImpressionTimer);
            currentImpressionTimer = null;
        }
        if (adContainer) {
            adContainer.style.display = 'none';
            adContainer.innerHTML = '';
            isAdClosed = true;
            imageUrl = redirectUrl = adsId = '';
        }
    }
    function closeAd() {
        clearAd();
    }

    async function sendStatus(event) {
        if (!adsId || event !== 'middle') return;
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
    }, 5000); // Check every 60 seconds
})();
