var api, app, contact, emailField, errorMessage, fieldIsValid, form, nameField, onSubmit, photoField, setError, submitBtn, submitBtnRegularText, submitBtnSubmittingText, toggleClass, toggleSubmitButtonEnabled;

form = document.getElementById('contactForm');

nameField = document.getElementById('name');

emailField = document.getElementById('email');

photoField = document.getElementById('photo');

submitBtn = document.getElementById('submitBtn');

submitBtnRegularText = document.getElementById('submitBtnRegularText');

submitBtnSubmittingText = document.getElementById('submitBtnSubmittingText');

errorMessage = document.getElementById('errorMessage');

setError = function(message) {
  console.log('setting error', message, errorMessage);
  errorMessage.innerHTML = message;
  if (message) {
    errorMessage.classList.remove('hide');
  } else {
    errorMessage.classList.add('hide');
  }
  return console.log('error set', errorMessage.classList.contains('hide'));
};

toggleClass = function(el, cls) {
  if (el.classList.contains(cls)) {
    return el.classList.remove(cls);
  } else {
    return el.classList.add(cls);
  }
};

toggleSubmitButtonEnabled = function() {
  toggleClass(submitBtnRegularText, 'hide');
  toggleClass(submitBtnSubmittingText, 'hide');
  toggleClass(submitBtn, 'btn-success');
  toggleClass(submitBtn, 'btn-light');
  return submitBtn.disabled = !submitBtn.disabled;
};

fieldIsValid = function(field) {
  if (field.value.length === 0) {
    field.classList.add('is-invalid');
    return false;
  } else {
    field.classList.remove('is-invalid');
    return true;
  }
};

api = {
  //base_uri: 'http://localhost:8080'
  base_uri: 'https://dbw13.atrcc.com/FM17_Data_API_demo-middleman/public/index.php'
};

app = {
  project: 'FM17_REST_DEMO',
  environment: 'DEV-LOCAL',
  version: 'v1.0.0'
};

contact = {
  name: {
    first: '',
    last: '',
    set: function(nameField) {
      var nameArr;
      nameArr = nameField.value.split(' ');
      if (nameArr.length > 1) {
        this.last = nameArr.splice(-1).join();
      }
      return this.first = nameArr.join(' ');
    }
  },
  email: '',
  add: function() {
    var formData, p;
    formData = new FormData();
    formData.append("name_first", this.name.first);
    formData.append("name_last", this.name.last);
    formData.append("email", this.email);
    if (photoField.value !== "") {
      formData.append('photo', photoField.files[0]);
    }
    p = fetch(api.base_uri + '/contacts', {
      method: 'POST',
      headers: new Headers([['X-RCC-PROJECT', app.project], ['X-RCC-ENVIRONMENT', app.environment], ['X-RCC-VERSION', app.version]]),
      body: formData,
      cache: 'no-cache'
    });
    return p;
  }
};

onSubmit = function(event) {
  var emailValid, nameValid;
  nameValid = fieldIsValid(nameField);
  emailValid = fieldIsValid(emailField);
  if (!nameValid || !emailValid) {
    if (event) {
      event.preventDefault();
    }
    return false;
  }
  toggleSubmitButtonEnabled();
  // prep the entered data
  contact.email = emailField.value;
  contact.name.set(nameField);
  
  // Do ajaxy stuff
  contact.add().then(function(response) {
    if (!response.ok) {
      throw Error(response.status + ' ' + response.statusText);
    }
    return response;
  }).then(function(response) {
    return window.location = './thanks.html';
  }).catch(function(error) {
    console.log('error', error);
    toggleSubmitButtonEnabled();
    setError(error);
    if (event) {
      event.preventDefault();
    }
    return false;
  });
  if (event) {
    event.preventDefault();
  }
  return false;
};

form.addEventListener('submit', onSubmit, false);

//# sourceMappingURL=maps/index.js.map
