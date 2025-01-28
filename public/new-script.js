(function() {
    const config = {
        callUrl: 'https://rdev-ade-an.hydro.online',
        eventURl: 'https://rdev-ad-events.hydro.online',
        encryptionKey: 'u8vB3tY5wQz9LmNp4RfXc2PkSjVh6DnO',
        useEncryption: true
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
            // Convert to Base64 to make the encrypted data readable and transmittable
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
            lastAccessed: Date.now(), // Add timestamp for session tracking
            fetchBanner422Error: false
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
    }

    // Modify getAdsId function to use the stored adSessionId
    async function getAdsId() {
        if (isFetchingAd) return;
        isFetchingAd = true;   
        try {
            currentAdRequestId = generateAdSessionId();
              // Hardcoded response instead of making the actual fetch call
              const mockResponse = {
                AdInfo: {
                    ad_id: "test_ad_123",
                    ad_creative_url: "https://dev-creativestore-an.hydro.online/hydro-test-gif-1.gif",
                    redirect_url: "https://example.com/test-ad",
                    campaign_id: "test_campaign_456"
                },
                reset_ad: false
            };

            // Use the mock response directly
            adsId = mockResponse.AdInfo.ad_id;
            imageUrl = mockResponse.AdInfo.ad_creative_url;
            redirectUrl = mockResponse.AdInfo.redirect_url;
            campID = mockResponse.AdInfo.campaign_id;
    
            if (!imageUrl) throw new Error('Image URL not received');
            alreadyShownAds.push(adsId);
            return { adsId, imageUrl, redirectUrl };
        } catch (error) {
            console.error('Error getting ad data:', error);
            sendErrorReport('FETCH_AD_NEW_SESSION', error.message);
            throw error;
        } finally {
            isFetchingAd = false;
        }
    }

    // Create ad container dynamically
    function createAdContainer() {
        adContainer = document.createElement('div');
        Object.assign(adContainer.style, {
            position: 'fixed',
            bottom: '2%',
            left: '0',
            width: '96%',
            height: '160px',
            zIndex: '1000',
            overflow: 'hidden',
            marginLeft: '2%'
        });
        document.body.appendChild(adContainer);
    }

    function displayBanner() {
        if (!imageUrl || !adContainer) return;
        adContainer.innerHTML = '';
    
        const scrollWrapper = document.createElement('div');
        Object.assign(scrollWrapper.style, {
            display: 'flex',
            height: '100%',
            position: 'relative',
            transition: 'transform 0.3s ease',
            width: '600%' // 6 times the container width for 6 blocks
        });
    
        // Create all content blocks
        const contentBlocks = [];
        for (let i = 0; i < 6; i++) {
            const contentBlock = document.createElement('div');
            Object.assign(contentBlock.style, {
                display: 'flex',
                flexDirection: 'column',
                height: '90%',
                width: '16.666%', // 100% / 6 blocks
                minWidth: '16.666%', // Prevent shrinking
                borderRadius: '14px',
                overflow: 'hidden',
                marginRight:'0.5%',
                position: 'relative',
                backgroundColor: 'white'
            });
            const topSection = document.createElement('div');
        Object.assign(topSection.style, {
            display: 'flex',
            height: '100px',
            width: '100%'
        });
        const topTextContainer = document.createElement('div');
        Object.assign(topTextContainer.style, {
            width: '40%',
            padding: '15px',
            boxSizing: 'border-box',
            cursor: 'pointer'
        });
        
        const imgContainer = document.createElement('div');
        Object.assign(imgContainer.style, {
            width: '60%',
            height: '90%',
            overflow: 'hidden',
            cursor: 'pointer',
            position: 'relative',
            marginRight: '1.4%'
        });
        const img = document.createElement('img');
        Object.assign(img.style, {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '8px'
        });
        img.src = imageUrl;
        const bottomContent = document.createElement('div');
        Object.assign(bottomContent.style, {
            display: 'flex',
            width: '100%',
            height: '60px',
            alignItems: 'center'
        });
        const imageTextContainer = document.createElement('div');
            Object.assign(imageTextContainer.style, {
                width: '50%',
                padding: '5px 15px',
                boxSizing: 'border-box'
            });

            const bottomSection = document.createElement('div');
            Object.assign(bottomSection.style, {
                width: '50%',
                padding: '15px',
                display: 'flex',
                alignItems: 'center',
                boxSizing: 'border-box',
                cursor: 'pointer'
            });
   
        imageTextContainer.innerHTML = `
        <p style="margin: 0 0 5px 0; font-size: 10px; color: black; opacity: 0.35">To enhance your browsing experience and help support this website, we use Hydro's Web3 technology for monetization.</p>
        <p style="margin: 0; font-size: 10px; color: black; opacity: 0.35">This allows the site to generate revenue for the content that is created daily and support the publisher.</p>
    `;

            topTextContainer.innerHTML = `
            <p style="margin: 0 0 5px 0; font-size: 10px; color: black">By continuing to use this site, you agree to the use of Hydro's monetization solution.</p>
            <p style="margin: 0; font-size: 10px; color: black">You can close this banner by clicking this Ad section.</p>
        `;

            bottomSection.innerHTML = `
            <p style="margin: 0; font-size: 14px; color: black; opacity: 0.35">Powered by</p> <?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="124" height="24" viewBox="0 0 402 84">
<path d="M0 0 C4.90713015 2.31973425 7.8111048 5.71776931 11 10 C12.14077657 13.42232972 12.09815117 16.08673217 12.0625 19.6875 C12.05347656 20.86699219 12.04445312 22.04648437 12.03515625 23.26171875 C12.02355469 24.16535156 12.01195312 25.06898437 12 26 C14.8299093 26.00491965 14.8299093 26.00491965 18 25 C19.92482463 22.83420041 21.39517826 20.90857429 22.9375 18.5 C23.80369474 17.22588702 24.67088534 15.9524505 25.5390625 14.6796875 C25.95704102 14.05416992 26.37501953 13.42865234 26.80566406 12.78417969 C28.4274914 10.36138448 30.09095464 7.97802925 31.8125 5.625 C32.31394531 4.91601562 32.81539062 4.20703125 33.33203125 3.4765625 C35 2 35 2 37.57421875 1.6484375 C40 2 40 2 42 4 C42.3219519 7.06765487 42.5192559 10.04784662 42.625 13.125 C42.66077148 14.04555176 42.69654297 14.96610352 42.73339844 15.91455078 C42.83997266 18.94278118 42.92356385 21.97086363 43 25 C43.02868164 26.06541016 43.05736328 27.13082031 43.08691406 28.22851562 C43.16310745 31.44406943 43.21174134 34.65878791 43.25 37.875 C43.27143066 38.87805176 43.29286133 39.88110352 43.31494141 40.91455078 C43.34801076 48.16408705 42.45359121 53.00116629 37.75 58.75 C33.26870156 62.41651691 29.3255793 64.34370536 23.5 63.9375 C19.05626738 63.1968779 15.32185543 62.14832566 12 59 C8.12190232 53.32350987 6.37845611 47.81221007 6 41 C2.52852158 40.25042843 2.52852158 40.25042843 -1 40 C-1.226875 40.51433594 -1.45375 41.02867188 -1.6875 41.55859375 C-3.50529817 44.93991475 -5.74546057 47.9608979 -8 51.0625 C-11.56238402 55.98744445 -11.56238402 55.98744445 -15 61 C-18 61.3125 -18 61.3125 -21 61 C-23.45896383 58.54103617 -23.25946963 57.84396404 -23.29052734 54.46191406 C-23.30328705 53.52043518 -23.31604675 52.5789563 -23.32919312 51.60894775 C-23.33141876 50.58815125 -23.33364441 49.56735474 -23.3359375 48.515625 C-23.3425943 47.46727478 -23.3492511 46.41892456 -23.35610962 45.33880615 C-23.36625054 43.11618813 -23.3709262 40.89353957 -23.37060547 38.67089844 C-23.3749647 35.27747934 -23.41123163 31.88537508 -23.44921875 28.4921875 C-23.45508944 26.33333778 -23.45905714 24.17448188 -23.4609375 22.015625 C-23.47530853 21.00292542 -23.48967957 19.99022583 -23.50448608 18.94683838 C-23.46587085 12.9593917 -22.97034829 9.56685385 -19 5 C-12.83158263 -0.43408197 -8.10039388 -0.75377191 0 0 Z " fill="#5600FF" transform="translate(23,0)"/>
<path d="M0 0 C2.64 0 5.28 0 8 0 C8.02505615 0.56509277 8.0501123 1.13018555 8.07592773 1.71240234 C8.19179956 4.26683742 8.31456537 6.8208955 8.4375 9.375 C8.47681641 10.26445313 8.51613281 11.15390625 8.55664062 12.0703125 C8.61948242 13.34648438 8.61948242 13.34648438 8.68359375 14.6484375 C8.72025146 15.43395996 8.75690918 16.21948242 8.79467773 17.02880859 C8.890891 19.07523496 8.890891 19.07523496 10 21 C11.82676431 21.85318539 11.82676431 21.85318539 14 22 C15.32 21.34 16.64 20.68 18 20 C18.33 13.4 18.66 6.8 19 0 C21.64 0 24.28 0 27 0 C27.07449251 4.44739413 27.12876257 8.8944519 27.16479492 13.34228516 C27.17982543 14.85341727 27.20025564 16.36450618 27.22631836 17.87548828 C27.26295689 20.05512187 27.27978338 22.23417575 27.29296875 24.4140625 C27.3086792 25.7232666 27.32438965 27.0324707 27.34057617 28.38134766 C26.85463828 33.54448127 25.2593828 36.77290906 21.5625 40.375 C16.36205188 42.74713423 11.62471588 42.7638503 6 42 C1.47572449 39.85692213 -0.8594463 37.51894669 -3 33 C-3 32.34 -3 31.68 -3 31 C2.40104167 30.734375 2.40104167 30.734375 5 31 C6 32 7 33 8 34 C10.79382198 34.40077696 13.14457214 34.22662126 16 34 C16.66 33.34 17.32 32.68 18 32 C18 30.68 18 29.36 18 28 C17.46375 28.33 16.9275 28.66 16.375 29 C13.29659181 30.29617187 11.32283362 30.39874003 8 30 C4.66021773 28.26588228 2.53863717 27.08078965 0.84033203 23.6730957 C-0.02656914 20.91548358 -0.23065014 18.79798666 -0.1953125 15.91796875 C-0.18886719 14.98662109 -0.18242188 14.05527344 -0.17578125 13.09570312 C-0.15902344 12.13599609 -0.14226562 11.17628906 -0.125 10.1875 C-0.11597656 9.20845703 -0.10695313 8.22941406 -0.09765625 7.22070312 C-0.07417182 4.81354939 -0.0413284 2.40690257 0 0 Z " fill="#5600FF" transform="translate(128,22)"/>
<path d="M0 0 C2.64 0 5.28 0 8 0 C8 13.53 8 27.06 8 41 C5.69 41 3.38 41 1 41 C0.67 40.34 0.34 39.68 0 39 C-0.639375 39.515625 -1.27875 40.03125 -1.9375 40.5625 C-6.20899845 42.56748907 -9.50713184 42.29723658 -14 41 C-17.22869681 39.22148057 -19.40301171 36.9497541 -21.375 33.8125 C-22.61202573 28.24588421 -22.713082 23.0266541 -20.8125 17.625 C-18.13448157 13.74649055 -15.47625233 11.49208411 -11 10 C-6.34311578 9.74598813 -4.25899298 9.87050351 0 12 C0 8.04 0 4.08 0 0 Z M-11.75 19 C-14.26373588 22.35164784 -14.7630571 23.97899743 -14.484375 28.05859375 C-13.6143643 31.54565275 -11.90922988 33.03943204 -9 35 C-5.54094288 35.06918114 -3.82704229 34.66163383 -1.125 32.5 C0.5921843 28.68403488 0.81315056 25.10339868 0 21 C-2.08754352 18.3121661 -2.08754352 18.3121661 -5 17 C-9.02757055 16.60788553 -9.02757055 16.60788553 -11.75 19 Z " fill="#5600FF" transform="translate(181,11)"/>
<path d="M0 0 C2.64 0 5.28 0 8 0 C8 3.96 8 7.92 8 12 C9.32 11.34 10.64 10.68 12 10 C18.69362364 9.2442683 18.69362364 9.2442683 21.81640625 11.05078125 C23.98949346 12.8259055 25.73685603 14.47371206 27 17 C27.08471364 18.81341842 27.10721083 20.62994161 27.09765625 22.4453125 C27.09443359 23.52167969 27.09121094 24.59804688 27.08789062 25.70703125 C27.07951172 26.83496094 27.07113281 27.96289062 27.0625 29.125 C27.05798828 30.26066406 27.05347656 31.39632812 27.04882812 32.56640625 C27.03701615 35.37765638 27.02054507 38.1888023 27 41 C24.36 41 21.72 41 19 41 C18.98018066 40.37432129 18.96036133 39.74864258 18.93994141 39.10400391 C18.84485774 36.27723481 18.73511254 33.45122185 18.625 30.625 C18.5940625 29.64015625 18.563125 28.6553125 18.53125 27.640625 C18.49257812 26.69960938 18.45390625 25.75859375 18.4140625 24.7890625 C18.36693115 23.48509521 18.36693115 23.48509521 18.31884766 22.15478516 C18.18770567 19.79038206 18.18770567 19.79038206 16 18 C12.93008319 18.16442277 12.93008319 18.16442277 10 19 C8.82530556 21.34938888 8.79965111 22.95073205 8.68359375 25.5703125 C8.64169922 26.46621094 8.59980469 27.36210938 8.55664062 28.28515625 C8.51732422 29.22230469 8.47800781 30.15945312 8.4375 31.125 C8.39431641 32.06988281 8.35113281 33.01476563 8.30664062 33.98828125 C8.20040928 36.32537092 8.09836824 38.6625683 8 41 C5.36 41 2.72 41 0 41 C0 27.47 0 13.94 0 0 Z " fill="#5600FF" transform="translate(97,11)"/>
<path d="M0 0 C4.76685349 2.54971233 7.2854028 5.17652089 8.97265625 10.23828125 C9.70119305 17.06980665 9.24186874 21.7649319 4.97265625 27.23828125 C0.88326276 30.80855484 -3.36798851 31.95430057 -8.75 31.6875 C-14.07816798 30.63648916 -17.82855905 27.84914818 -21.02734375 23.55078125 C-22.63449402 18.22709599 -23.19410364 13.19507021 -21.11328125 7.921875 C-16.60733815 0.02920692 -8.72691972 -3.27890047 0 0 Z M-13.02734375 9.23828125 C-14.64233396 12.46826168 -14.60710579 15.74638117 -14.02734375 19.23828125 C-12.15093205 22.44841172 -12.15093205 22.44841172 -9.02734375 24.23828125 C-5.24043684 24.30357275 -3.06660775 24.07639738 -0.08984375 21.67578125 C1.43871941 18.16907753 1.76593702 14.94760336 0.97265625 11.23828125 C-1.11192046 8.15250621 -1.11192046 8.15250621 -4.02734375 6.23828125 C-8.32121386 6.23828125 -9.61600859 6.84112681 -13.02734375 9.23828125 Z " fill="#5600FF" transform="translate(235.02734375,21.76171875)"/>
<path d="M0 0 C2.64 0 5.28 0 8 0 C8.33 0.66 8.66 1.32 9 2 C9.66 1.34 10.32 0.68 11 0 C14.625 -0.125 14.625 -0.125 18 0 C18 2.64 18 5.28 18 8 C17.43410156 8.10957031 16.86820313 8.21914063 16.28515625 8.33203125 C15.55167969 8.49058594 14.81820312 8.64914063 14.0625 8.8125 C13.33160156 8.96332031 12.60070312 9.11414062 11.84765625 9.26953125 C10.93306641 9.63111328 10.93306641 9.63111328 10 10 C9.13580777 12.59257669 8.82419068 14.34037707 8.68359375 17.01171875 C8.64169922 17.76904297 8.59980469 18.52636719 8.55664062 19.30664062 C8.51732422 20.09232422 8.47800781 20.87800781 8.4375 21.6875 C8.39431641 22.48478516 8.35113281 23.28207031 8.30664062 24.10351562 C8.20072632 26.06881447 8.09987449 28.03438496 8 30 C5.36 30 2.72 30 0 30 C0 20.1 0 10.2 0 0 Z " fill="#5600FF" transform="translate(194,22)"/>
</svg>
        `;
          // Add separate click handlers for image and text
          imgContainer.onclick = (e) => {
            e.stopPropagation(); // Prevent event bubbling
            handleAdClick(contentBlock, redirectUrl, 'image');
        };

        topTextContainer.onclick = (e) => {
            e.stopPropagation();
            handleAdClick(contentBlock, 'https://www.hydro.online/', 'top-text');
        };

        bottomSection.onclick = (e) => {
            e.stopPropagation();
            handleAdClick(contentBlock, 'https://www.hydro.online/', 'bottom-text');
        };

        imgContainer.appendChild(img);
        topSection.appendChild(topTextContainer);
        topSection.appendChild(imgContainer);
        contentBlock.appendChild(topSection);
        
        // Add both containers to bottomContent
        bottomContent.appendChild(bottomSection);
        bottomContent.appendChild(imageTextContainer);
       
        
        // Add bottomContent to contentBlock
        contentBlock.appendChild(bottomContent);
        
        scrollWrapper.appendChild(contentBlock);
        contentBlocks.push(contentBlock);
    }
      // Update container styles for new dimensions
      Object.assign(adContainer.style, {
        height: '160px',
        width: '96%'
    });
        adContainer.appendChild(scrollWrapper);
        adContainer.style.display = 'block';
        isAdClosed = false;
    
        // Wait for all images to load
        Promise.all(contentBlocks.map(block => {
            const img = block.querySelector('img');
            return new Promise((resolve) => {
                if (img.complete) {
                    resolve();
                } else {
                    img.onload = () => resolve();
                    img.onerror = () => resolve();
                }
            });
        })).then(() => {
            contentBlocks.forEach((block, index) => {
                block.endEventSent = false;
                block.onclick = () => handleAdClick(block, redirectUrl);
                
                const observer = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            if (!block.startEventSent) {
                                block.startEventSent = true;
                                sendStatus('start');
                                
                                const checkRightEdge = () => {
                                    const rect = block.getBoundingClientRect();
                                    const windowWidth = window.innerWidth;
                                    
                                    if (rect.right <= windowWidth && !block.midEventSent) {
                                        block.midEventSent = true;
                                        sendStatus('middle');
                                        cancelAnimationFrame(block.rafId);
                                    }
                                    
                                    if (!block.midEventSent) {
                                        block.rafId = requestAnimationFrame(checkRightEdge);
                                    }
                                };
                                checkRightEdge();
                            }
                        } else {
                            if (block.startEventSent && block.midEventSent && !block.endEventSent) {
                                block.endEventSent = true;
                                sendStatus('end');
                            }
                        }
                    });
                }, { threshold: [0] });
                
                observer.observe(block);
            });
    
            const singleBlockWidth = contentBlocks[0].offsetWidth + 20; // Include margin
            startScrolling(scrollWrapper, singleBlockWidth);
        });
    }

    function handleAdClick(block, currentRedirectUrl, clickSource) {
        adSessionData.adClicked = true;
        adSessionData.clickTimestamp = Date.now();
        saveAdSession();
        
        // You might want to modify sendClickStatus to include the click source
        sendClickStatus(clickSource);
        closeAd();
        window.open(currentRedirectUrl, '_blank');
    }

    function shouldShowAd() {
        if (!adSessionData.adClicked) return true;
        const elapsedTime = Date.now() - adSessionData.clickTimestamp;
        return elapsedTime >= adSessionData.timeDelay;
    }

    async function sendClickStatus() {
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
    }

    function startScrolling(element, singleImageWidth) {
        if (scrollInterval) {
            clearInterval(scrollInterval);
        }
    
        // Speed calculation for 10-second duration per image
        const singleImageDuration = 20000; // 10 seconds for one image to complete its journey
        const totalDistance = window.innerWidth + singleImageWidth; // Distance from start appearing to completely disappearing
        const speed = 0;
        
        let position = 0;
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
            if (adSessionData.fetchBanner422Error) {
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
    }, 60000); // Check every 60 seconds
})();