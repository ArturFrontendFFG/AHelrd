export default function profileModule() {
  const imageInput = document.querySelector('.sidebar__file-hidden');
  const imagePreview = document.querySelector('.sidebar__avatar');
  if(imageInput){
    if (localStorage.getItem('selectedImage')) {
      imagePreview.setAttribute('src', localStorage.getItem('selectedImage'));
    }
    imageInput.addEventListener('change', function(event) {
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          imagePreview.setAttribute('src', e.target.result);
          localStorage.setItem('selectedImage', e.target.result);
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    });
  }

  const inputAboutYou = document.getElementById(`sayAboutYou`) 
  const textAboutYou = document.querySelector(`.sidebar__about-me`) 

  inputAboutYou.addEventListener(`input`, updataText);

  if(localStorage.getItem('textAboutYou') && localStorage.getItem(`textAboutYou`).length > 0){
    textAboutYou.innerHTML = localStorage.getItem(`textAboutYou`);
    inputAboutYou.innerHTML = localStorage.getItem(`textAboutYou`)
  }
  function updataText(){
    textAboutYou.innerHTML = inputAboutYou.value;
    localStorage.setItem(`textAboutYou`, inputAboutYou.value)
  }

}

