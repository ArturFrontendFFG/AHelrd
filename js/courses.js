export default function coursesModule() {
    let accordions = document.querySelectorAll(`.accordion`);
    accordions.forEach(accordion => {
       const accordionHeader = accordion.querySelector(`.accordion__name-courses`);
       const accordionBody = accordion.querySelector(`.accordion__body`);

       accordionHeader.addEventListener(`click`, () => {
        const heightAccordionBody = accordionBody.scrollHeight;
        accordionHeader.classList.toggle(`active`);
        if(accordionHeader.classList.contains(`active`)){
            accordionBody.style.height = heightAccordionBody + 'px'; 
            accordionHeader.children[1].style.transform = 'rotate(180deg)'
        }else{
            accordionBody.style.height = '0px'; 
            accordionHeader.children[1].style.transform = 'rotate(0deg)'

        }   
       })
    })
}