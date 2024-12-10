const calcMaxPos = function(parentWidth, childWidth) {
  return -(((childWidth - parentWidth)/parentWidth)*100);
}

const calcNewPosition = function(pos){
  let newPosition = (sliderPosition + pos);
  if(newPosition > 0){
    newPosition = (sliderPosition + pos)*0.1;
  }else if(newPosition < maxPos){
    newPosition = (maxPos+((pos*0.1)));
  }
  return newPosition;
}

const sliderPosUpdate = function(pos) {  
  
  sliders.forEach(item =>{
    item.style.left = `${calcNewPosition(pos)}%`;
  });
}

const onClick = function(event) {
  if(mousePos === 0){
  }
}

const onMove = function(event) {
  mouseMoveNew = event.clientX || event.touches[0].clientX;
  mousePos = mousePos + (mouseMoveNew - mouseMove);
  mouseMove = mouseMoveNew;
  
  sliderPosUpdate((mousePos/wrapperWidth)*100);
};

const onDown = function(event) {
  mousePos = 0;
  mouseMove = event.clientX || event.touches[0].clientX;
  wrapper.addEventListener('mousemove', onMove, false);
  wrapper.addEventListener('touchmove', onMove, false);
};

const onUp = event => {
  sliderPosition = calcNewPosition((mousePos/wrapperWidth)*100);
  
  if(sliderPosition <= maxPos){
    sliderPosition = maxPos;
    slider.style.left = `${maxPos}%`;
  }else if(sliderPosition > 0){
    sliderPosition = 0;
    slider.style.left = '0';
  }else{
    sliderPosition = (Math.round(sliderPosition/7.15)*7.15);
    slider.style.left = `${sliderPosition}%`;
  }
 wrapper.removeEventListener('mousemove', onMove);
  wrapper.removeEventListener('touchmove', onMove);
};

// Handles redefining container widths and max slide position
const onResize = event => {
  wrapperWidth = wrapper.clientWidth;
  sliderWidth = slider.clientWidth;
};


const wrapper = document.querySelector(".container");

const sliders = document.querySelectorAll(".mySlider");
const slider = sliders[0];
const dates = slider.querySelectorAll(".slideItems");
const datesLength = 5;

let wrapperWidth = wrapper.clientWidth;
let sliderWidth = slider.clientWidth;
let sliderPosition = 0;
let maxPos = calcMaxPos(wrapperWidth, sliderWidth);
let mousePos = 0;
let mouseMove = 0;

//Add event listener for dates
dates.forEach(date => {
  date.addEventListener('click', onClick, false);
  date.addEventListener('touch', onClick, false);
});

//Add event listener for wrapper
wrapper.addEventListener('mousedown', onDown, true);
wrapper.addEventListener('touchstart', onDown, true);

//Add event listener for wrapper
wrapper.addEventListener('mouseup', onUp, true);
wrapper.addEventListener('touchend', onUp, true);
wrapper.addEventListener('mouseleave', onUp);

//Add event listener for window resize
window.addEventListener('resize', onResize);

