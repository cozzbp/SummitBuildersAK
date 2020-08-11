const EMAIL = 'entry.1957490318';
const IP = 'entry.2081840150';
const REGION = 'entry.2136002374';
const CITY = 'entry.900075394';

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const result = re.test(email);

  return result;
}

const getPublicIP = async () => {
  const reqObj = {
    method: 'GET'
  };
  let returnIP = {};
  await fetch('http://ip-api.com/json', reqObj)
    .then((response) => {
      returnIP = response.json();
    })
    .catch((err) => {
      console.warn('err', err);
    });
  return returnIP;
}

const showSnackbar = (msg) => {
  var x = document.getElementById("snackbar");

  x.className = "show";
  x.innerText = msg;
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

const submitForm = async (e) => {
  e.preventDefault()
  const ip = await getPublicIP();

  const email = document.getElementById("email-input").value;
  const validEmail = validateEmail(email);

  if (!validEmail) {
    showSnackbar("ENTER A VALID EMAIL ADDRESS");
    //document.getElementById("submit-form").reportValidity();
    return;
  }

  this.loading = true;

  const formData = {
    [EMAIL]: email,
    [IP]: ip.query,
    [REGION]: ip.regionName,
    [CITY]: ip.city
  };
  const formBody = Object.keys(formData).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(formData[key])}`).join('&');

  const path = 'https://docs.google.com/forms/d/e/1FAIpQLSc9qTOUcfzglvzdvcYR_hzZJ0UzP2xMLQUA4LRLhdnrYimKrA/formResponse';
  const reqObj = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: formBody,
    mode: 'no-cors'
  };

  return fetch(path, reqObj)
    .then((status) => {
      const emailInput = document.getElementById("email-input");
      emailInput.disabled = true;
      const submitButton = document.getElementById("submit-btn");
      
      document.getElementById("submit-btn").removeEventListener("click", submitForm);
      document.getElementById("submit-form").removeEventListener("submit", submitForm);
      //submitButton.remove();

      const submitIcon = document.getElementById("submit-icon");
      submitIcon.innerText = "done";
      submitIcon.style.color = "rgba(113, 227, 166, 0.9)"
      submitIcon.style.filter = "drop-shadow(1px 1px 7px rgba(113, 227, 166, 1))"
      showSnackbar("THANK YOU");
    })
    .catch((err) => {
      console.error(err);
      showSnackbar("ERROR");
    });
}


document.getElementById("submit-btn").addEventListener("click", submitForm);
document.getElementById("submit-form").addEventListener("submit", submitForm);

document.getElementById("submit-form").addEventListener("invalid", (e) => {
  e.preventDefault();
});
