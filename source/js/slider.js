document.querySelector('.slider__control').classList.remove('slider__control--hide');

const beforeBtn = document.getElementById('before-button');
const afterBtn = document.getElementById('after-button');
const beforeSlide = document.querySelector('.slider__item--before');
const afterSlide = document.querySelector('.slider__item--after');
const sliderControl = document.querySelector('.slider__control');
const sliderBar = document.querySelector('.slider__bar');
const sliderThumb = document.querySelector('.slider__thumb');

beforeBtn.addEventListener('click', handleSlider);
afterBtn.addEventListener('click', handleSlider);
sliderControl.addEventListener('pointerdown', handleSlider);

window.addEventListener('pointerup', function () {
  sliderControl.removeEventListener('pointermove', handleSlider)
});

window.addEventListener('resize', function () {
  if (window.innerWidth < 768) {
    beforeSlide.style.width = 'auto';
    afterSlide.style.width = 'auto';
  }
})

function checkCoords(coords) {
  let percents;
  let sliderBarStart = sliderBar.offsetLeft;
  let sliderBarWidth = sliderBar.offsetWidth;
  let sliderBarEnd = sliderBarWidth + sliderBarStart;
  if (coords >= sliderBarStart && coords <= sliderBarEnd) {
    percents = Math.round((coords - sliderBarStart) * 100 / sliderBarWidth);
    return percents;
  }
}

function handleSlider(event) {
  if (event.target == beforeBtn) {
    moveThumb(0);
    changeSlide(0)
  } else if (event.target == afterBtn) {
    moveThumb(100);
    changeSlide(100)
  }
  else {
    sliderControl.addEventListener('pointermove', handleSlider);
    moveThumb(checkCoords(event.pageX));
    changeSlide(checkCoords(event.pageX));
  }
}

function moveThumb(percents) {
  if (window.innerWidth < 768) {
    let margin;
    percents < 50 ? margin = '0' : margin = 'auto';
    sliderThumb.style.marginLeft = margin;
  } else {
    sliderThumb.style.left = percents + '%';
  }
}

function changeSlide(percents) {
  if (window.innerWidth < 768) {
    if (percents < 50) {
      afterSlide.classList.remove('slider__item--current');
      beforeSlide.classList.add('slider__item--current');
    } else {
      beforeSlide.classList.remove('slider__item--current');
      afterSlide.classList.add('slider__item--current');
    }
  } else {
    beforeSlide.style.width = 100 - percents + "%"
    afterSlide.style.width = percents + "%"
  }
}
