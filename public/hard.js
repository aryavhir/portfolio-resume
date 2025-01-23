(function() {
    const config = {
        callUrl: 'https://dev-ade-an.hydro.online',
        eventURl: 'https://dev-ad-events.hydro.online',
        encryptionKey: 'u8vB3tY5wQz9LmNp4RfXc2PkSjVh6DnO',
        countryValidationUrl: 'https://dev-ad-traffic-regulation-config.hydro.online/regulate.json',
        useEncryption: false
    };
    const urlParams = new URLSearchParams(document.currentScript.src.split('?')[1]);
    const countryCodeFromUrl = urlParams.get('country_code');

    let adSessionData = {
        hostname: window.location.hostname,
        adSessionId: null,
        adClicked: false,
        clickTimestamp: null,
        timeDelay: 36000000, // 10 hours in milliseconds
        fetchBanner422Error: false,
        countryCode: countryCodeFromUrl,
        isCountryValid: null,
        countryValidated: false 
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
    async function validateCountry() {

        if (adSessionData.countryValidated) {
            return adSessionData.isCountryValid;
        }

        console.log('Validating country. Current country code:', adSessionData.countryCode); // Debug log
        try {
            const response = await fetch(config.countryValidationUrl);
            if (!response.ok) {
               console.log('Failed to fetch country validation data');
            }
            const data = await response.json();
            console.log('Validation data received:', data); // Debug log
            
            // Check if country exists and if ads should be shown
            if (adSessionData.countryCode && 
                data.countries && 
                data.countries[adSessionData.countryCode]) {
                adSessionData.isCountryValid = data.countries[adSessionData.countryCode].show_ad;
               
            } else {
                adSessionData.isCountryValid = false;
                console.log('Country not found in validation data or country code missing'); // Debug log
            }
            
     adSessionData.countryValidated = true; // Mark as validated
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
            timeDelay: 36000000,
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
        //replacing error call 
        // const payload = {
        //     ad_session_id: adSessionId,
        //     pot_session_id: window.session_id,
        //     ad_request_id: currentAdRequestId,
        //     ad_id: adsId,
        //     tag_id: tag_Id,
        //     campaign_id: campID,
        //     error_code: errorCode,
        //     error_message: errorMessage,
        //     request_timestamp: Math.floor(Date.now() / 1000) 
        // };

        // const processedPayload = preparePayload(payload);

        // fetch(config.eventURl + '/api/v1/ad-error', {
        //     method: 'POST',
        //     headers: {
        //         "Content-Type": 'application/json',
        //     },
        //     body: JSON.stringify(processedPayload)
        // }).then(response => response.json())
        // .then(responseData => {
        //     const data = processResponse(responseData);
        //     console.log('Error report sent:', data);
        // })
        // .catch(error => console.error('Error sending error report:', error));
        console.log('Error:', errorCode, errorMessage);
    }

    // Modify getAdsId function to use the stored adSessionId
    async function getAdsId() {
        if (isFetchingAd) return;
        isFetchingAd = true;   
        try {
            currentAdRequestId = generateAdSessionId();
    //replacing fetch-banner-call 
            //         const payload = {
    //             ad_session_id: adSessionData.adSessionId,
    //             tag_id: tag_Id,
    //             ad_request_id: currentAdRequestId,
    //             impression_count: 6,
    //             pot_session_id: window.session_id,
    //             already_shown_ad_ids: alreadyShownAds.join(","),
    //             country_code: adSessionData.countryCode,
    //             request_timestamp: Math.floor(Date.now() / 1000) 
    //         };
    
    //         // Encrypt the payload
    //         const processedPayload = preparePayload(payload);
    //         const response = await fetch(config.callUrl + '/api/v1/fetchbanner', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(processedPayload)
    //         });
    
    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             if (response.status === 422) {
    //             adSessionData.fetchBanner422Error = true;
    //             saveAdSession();
    //             throw new Error(JSON.stringify(errorData));
    //         } else {
    //             throw new Error(JSON.stringify(errorData));
    //         }
    //     }
    
    //         const responseData = await response.json();
    //         const data = processResponse(responseData);
    //         if (data.reset_ad === true) {
    //             console.log('Resetting already shown ads array');
    //             alreadyShownAds = [];
    //         }
    //         adsId = data.AdInfo.ad_id;
    //         imageUrl = data.AdInfo.ad_creative_url;
    //         redirectUrl = data.AdInfo.redirect_url;
    //         campID = data.AdInfo.campaign_id;
    
    //         if (!imageUrl) throw new Error('Image URL not received');
    //         alreadyShownAds.push(adsId);
    //         return { adsId, imageUrl, redirectUrl };
    //     } catch (error) {
    //         console.error('Error getting ad data:', error);
    //         sendErrorReport('FETCH_AD_NEW_SESSION', error.message);
    //         throw error;
    //     } finally {
    //         isFetchingAd = false;
    //     }
    // }
 // Hardcoded values for now
 adsId = "test_ad_123";
 imageUrl = "https://dev-creativestore-an.hydro.online/campaign-beta-1.png";
 redirectUrl = "https://example.com/test-ad";
 campID = "test_campaign_456";

 alreadyShownAds.push(adsId);
        return { adsId, imageUrl, redirectUrl };
    } catch (error) {
        console.error('Error getting ad data:', error);
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
        containerHeight = '145px';
        bottomPosition = '1%';
    } else if (screenWidth < 1025) { // Tablet
        containerHeight = '216px';
        bottomPosition = '2%';
    } else { // Desktop
        containerHeight = '165px';
        bottomPosition = '2%';
    }

    Object.assign(adContainer.style, {
        position: 'fixed',
        bottom: bottomPosition,
        left: '0',
        width: '96%',
        height: containerHeight,
        zIndex: '1000',
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
            display: 'flex',
            alignItems: 'center',
            transform: `translateX(${window.innerWidth}px)` // Start at window width
        });
        const getResponsiveImageUrl = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth < 576) {
                // Phone-specific image URL
                scrollDuration = 10000;
                return 'https://dev-creativestore-an.hydro.online/hydro-test-banner-mobile-3.png';
            } else if (screenWidth < 1025) {
                // Tablet-specific image URL
                scrollDuration = 10000; 
                return 'https://dev-creativestore-an.hydro.online/hydro-test-banner-tablet-1.png';
            }
            // Desktop image URL (default)
            scrollDuration = 20000;
            return 'https://dev-creativestore-an.hydro.online/hydro-test-gif-1.gif';
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
            minHeight: '135px',
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
        //replacing click status 
//         try {
//             const payload = {
//                 ad_session_id: adSessionId,
//                 ad_id: adsId,
//                 pot_session_id: window.session_id,
//                 ad_request_id: currentAdRequestId,
//                 campaign_id: campID,
//                 tag_id: tag_Id,
//                 redirect_url: redirectUrl,
//                 request_timestamp: Math.floor(Date.now() / 1000) 
//             };

//             const processedPayload = preparePayload(payload);

// const response = await fetch(config.eventURl + '/api/v1/ad-click', {
//     method: 'POST',
//     headers: { 
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(processedPayload)
// });
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(JSON.stringify(errorData));
//             }

//             const responseData = await response.json();
//             const data = processResponse(responseData);
//             console.log('Click status sent:', data);
//         } catch (error) {
//             sendErrorReport('CLICK_TRACK_ERROR', error.message);
//         }
console.log('Click event logged');
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
        //replacing display events
        // try {
        //     const payload = {
        //         ad_session_id: adSessionId,
        //         ad_id: adsId,
        //         pot_session_id: window.session_id,
        //         ad_request_id: currentAdRequestId,
        //         ad_position: event,
        //         campaign_id: campID,
        //         tag_id: tag_Id,
        //         request_timestamp: Math.floor(Date.now() / 1000) 
        //     };

        //     const processedPayload = preparePayload(payload);

        //     const response = await fetch(config.eventURl + '/api/v1/ad-display', {
        //         method: 'POST',
        //         headers: { 
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(processedPayload)
        //     });
        //     if (!response.ok) {
        //         const errorData = await response.json();
        //         throw new Error(JSON.stringify(errorData));
        //     }

        //     const responseData = await response.json();
        //     const data = processResponse(responseData);
        //     console.log('Status sent:', data);
        // } catch (error) {
        //     console.error('Error sending status:', error);
        //     sendErrorReport('DISPLAY_TRACK_ERROR', error.message);
        // }
        console.log('Status event:', event);
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
        //replace
        // if (adSessionData.fetchBanner422Error) {
        //     console.log('422 error previously received. No calls will be made until session ends.');
        //     return;
        // }
        //      // Validate country before proceedingantry();         
        //      if (!adSessionData.countryValidated) {
        //         const isValid = await validateCountry();
        //         if (!isValid) {
        //             console.log('Ads not allowed for country');
        //             return;
        //         }
        //     } else if (!adSessionData.isCountryValid) {
        //         console.log('Ads not allowed for country (using cached validation)');
        //         return;
        //     }
        //     if (shouldShowAd()) {
        //         try {
        //             await getAdsId();
        //             createAdContainer();
        //             displayBanner();
        //         } catch (error) {
        //             console.error('Failed to initialize ad:', error);
        //         }
        //     }
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
    }, 60000); // Check every 60 seconds
})();
