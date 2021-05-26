let forms = document.querySelectorAll('.form');
let requiredFields = document.querySelectorAll('.required');
requiredFields.forEach((item) => {
  item.removeAttribute('required')
});
forms.forEach((form) => {
  form.addEventListener('submit', checkForm)
});

function checkForm(evt) {
  requiredFields.forEach((field) => {
    if (field.value == '') {
      evt.preventDefault();
      field.setAttribute('required', true);
    }
  });
}
