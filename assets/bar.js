
var params = new URLSearchParams(window.location.search);

// Fallback: try to get data from localStorage if URL params are empty
if (params.toString() === '') {
    try {
        const storedData = localStorage.getItem('mObywatel_formData');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            // Handle both old and new format
            const formData = parsedData.data || parsedData;
            params = new URLSearchParams();
            for (const [key, value] of Object.entries(formData)) {
                params.set(key, value);
            }
            console.log('Loaded form data from localStorage for bar navigation');
        }
    } catch (error) {
        console.warn('Failed to load from localStorage:', error);
    }
}

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function sendTo(url){
    try {
        const fullUrl = `${url}.html?` + params;
        console.log('Navigating to:', fullUrl);
        console.log('URL length:', fullUrl.length);
        console.log('Is mobile:', isMobile());
        
        // For mobile devices or very long URLs, use localStorage method
        if (isMobile() || fullUrl.length > 2000) {
            console.warn('Using localStorage method for navigation');
            // Store current params in localStorage
            const formData = {};
            for (const [key, value] of params.entries()) {
                formData[key] = value;
            }
            const dataWithTimestamp = {
                data: formData,
                timestamp: Date.now(),
                version: '1.0'
            };
            localStorage.setItem('mObywatel_formData', JSON.stringify(dataWithTimestamp));
            localStorage.setItem('mObywatel_hasData', 'true');
            location.href = `${url}.html`;
            return;
        }
        
        location.href = fullUrl;
    } catch (error) {
        console.error('Navigation error:', error);
        location.href = `${url}.html`;
    }
}

document.querySelectorAll(".bottom_element_grid").forEach((element) => {
    element.addEventListener('click', () => {
        sendTo(element.getAttribute("send"))
    })
})

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
    if (/windows phone/i.test(userAgent)) {
        return 1;
    }
  
    if (/android/i.test(userAgent)) {
        return 2;
    }
  
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 3;
    }
  
    return 4;
  }
  
  if (getMobileOperatingSystem() == 2){
      document.querySelector(".bottom_bar").style.height = "70px"
}
