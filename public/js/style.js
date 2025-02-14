
try {
  const imgCard = document.querySelector(".showImgCard");
const close=document.querySelector(".closeHoverImg");
const zoomImg=document.querySelector(".zoomImg");
const container=document.querySelector(".hoverCont");
const img=document.querySelector(".imgHover");
const nav=document.querySelector(".navbar");
const footer=document.querySelector(".footer");
imgCard.addEventListener("click", function()
    {   
       zoomImg.classList.add("zoom");
       container.classList.add("hoverCont2");
       img.classList.add("d-block")
       img.classList.remove("d-none")
       nav.style.display="none";
       footer.style.display="none";
       close.classList.add("d-block")
       close.classList.remove("d-none")
     });
close.addEventListener("click",()=>{
  zoomImg.classList.remove("zoom");
  container.classList.remove("hoverCont2");
  img.classList.remove("d-block")
  img.classList.add("d-none");
  nav.style.display="block";
  footer.style.display="block";
  close.classList.remove("d-block")
  close.classList.add("d-none")
});
} catch (error) {
  console.log(error)
}



// Example starter JavaScript for disabling form submissions if there are invalid fields

//form validation
try {
  (() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()
  
  
} catch (error) {
  console.log(error)
}

