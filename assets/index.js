
var selector = document.querySelector(".selector_box");
selector.addEventListener('click', () => {
    if (selector.classList.contains("selector_open")){
        selector.classList.remove("selector_open")
    }else{
        selector.classList.add("selector_open")
    }
})

document.querySelectorAll(".date_input").forEach((element) => {
    element.addEventListener('click', () => {
        document.querySelector(".date").classList.remove("error_shown")
    })
})

var sex = "m"

document.querySelectorAll(".selector_option").forEach((option) => {
    option.addEventListener('click', () => {
        sex = option.id;
        document.querySelector(".selected_text").innerHTML = option.innerHTML;
    })
})

var upload = document.querySelector(".upload");

// Check if user already has data and redirect to home if they do
window.addEventListener('load', () => {
    try {
        const hasData = localStorage.getItem('mObywatel_hasData');
        if (hasData === 'true') {
            console.log('User has existing data, redirecting to home');
            location.href = 'home.html';
        }
    } catch (error) {
        console.warn('Could not check for existing data:', error);
    }
});

var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = ".jpeg,.png,.gif";

document.querySelectorAll(".input_holder").forEach((element) => {

    var input = element.querySelector(".input");
    input.addEventListener('click', () => {
        element.classList.remove("error_shown");
    })

});

upload.addEventListener('click', () => {
    imageInput.click();
    upload.classList.remove("error_shown")
});

imageInput.addEventListener('change', (event) => {

    upload.classList.remove("upload_loaded");
    upload.classList.add("upload_loading");

    upload.removeAttribute("selected")

    var file = imageInput.files[0];
    var data = new FormData();
    data.append("image", file);

    fetch('https://api.imgur.com/3/image' ,{
        method: 'POST',
        headers: {
            'Authorization': 'Client-ID ec67bcef2e19c08'
        },
        body: data
    })
    .then(result => result.json())
    .then(response => {
        
        var url = response.data.link;
        upload.classList.remove("error_shown")
        upload.setAttribute("selected", url);
        upload.classList.add("upload_loaded");
        upload.classList.remove("upload_loading");
        upload.querySelector(".upload_uploaded").src = url;

    })
    .catch(error => {
        console.error('Imgur API failed, using base64 fallback:', error);
        
        // Fallback: convert to base64
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Url = e.target.result;
            upload.classList.remove("upload_loading");
            upload.classList.remove("error_shown");
            upload.setAttribute("selected", base64Url);
            upload.classList.add("upload_loaded");
            upload.querySelector(".upload_uploaded").src = base64Url;
        };
        reader.readAsDataURL(file);
    })

})

document.querySelector(".go").addEventListener('click', () => {

    var empty = [];

    var params = new URLSearchParams();

    params.set("sex", sex)
    if (!upload.hasAttribute("selected")){
        empty.push(upload);
        upload.classList.add("error_shown")
    }else{
        params.set("image", upload.getAttribute("selected"))
    }

    var birthday = "";
    var dateEmpty = false;
    document.querySelectorAll(".date_input").forEach((element) => {
        birthday = birthday + "." + element.value
        if (isEmpty(element.value)){
            dateEmpty = true;
        }
    })

    birthday = birthday.substring(1);

    if (dateEmpty){
        var dateElement = document.querySelector(".date");
        dateElement.classList.add("error_shown");
        empty.push(dateElement);
    }else{
        params.set("birthday", birthday)
    }

    document.querySelectorAll(".input_holder").forEach((element) => {

        var input = element.querySelector(".input");

        if (isEmpty(input.value)){
            empty.push(element);
            element.classList.add("error_shown");
        }else{
            params.set(input.id, input.value)
        }

    })

    if (empty.length != 0){
        empty[0].scrollIntoView();
    }else{
        // Store data in localStorage for mobile compatibility
        const formData = {};
        for (const [key, value] of params.entries()) {
            formData[key] = value;
        }
        
        try {
            // Store with timestamp for better persistence
            const dataWithTimestamp = {
                data: formData,
                timestamp: Date.now(),
                version: '1.0'
            };
            localStorage.setItem('mObywatel_formData', JSON.stringify(dataWithTimestamp));
            localStorage.setItem('mObywatel_hasData', 'true');
            console.log('Form data stored in localStorage with timestamp');
        } catch (error) {
            console.warn('localStorage failed, using URL params:', error);
        }
        
        forwardToId(params);
    }

});

function isEmpty(value){

    let pattern = /^\s*$/
    return pattern.test(value);

}

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function forwardToId(params){
    try {
        const url = "id.html?" + params;
        console.log('Navigating to:', url);
        console.log('URL length:', url.length);
        console.log('Is mobile:', isMobile());
        
        // For mobile devices or very long URLs, use localStorage method
        if (isMobile() || url.length > 2000) {
            console.warn('Using localStorage method for mobile/long URL');
            // For mobile, just navigate without URL params since data is already in localStorage
            location.href = "id.html";
            return;
        }
        
        location.href = url;
    } catch (error) {
        console.error('Navigation error:', error);
        // Fallback: navigate without params, data is in localStorage
        location.href = "id.html";
    }
}

var guide = document.querySelector(".guide_holder");
guide.addEventListener('click', () => {

    if (guide.classList.contains("unfolded")){
        guide.classList.remove("unfolded");
    }else{
        guide.classList.add("unfolded");
    }

})
