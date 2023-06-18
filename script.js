'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinks = document.querySelector('.nav__links');

const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = e => {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = () => {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Scroll To

btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();

  // This gives (x,y) which is the difference between the current position and the top of the page
  // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // Above code can be rearranged
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // New Method supported by modern browsers
  section1.scrollIntoView({ behavior: 'smooth' });
});

/// Event Delegation && Smoothe Scroll
navLinks.addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');

    if (id !== '#')
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Tabbed component

tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove activate tabs
  tabs.forEach(t => {
    t.classList.remove('operations__tab--active');
  });
  tabsContent.forEach(t => {
    t.classList.remove('operations__content--active');
  });

  // Active tab area
  clicked.classList.add('operations__tab--active');

  // Active content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

/////////////////////
// Menu fade animation

function changeOpacity(e) {
  // console.log(this, e.target);
  const link = e.target;
  if (!link) return;

  if (link.classList.contains('nav__link')) {
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');

    siblings.forEach(el => {
      if (el != link) el.style.opacity = this;
    });
    nav.querySelector('img').style.opacity = this;
  }
}

// Method 1:
// nav.addEventListener('mouseover', function (e) {
//   changeOpacity(e, 0.5);
// });

// nav.addEventListener('mouseout', function (e) {
//   changeOpacity(e, 1);
// });

// Method 2:
nav.addEventListener('mouseover', changeOpacity.bind(0.5));
nav.addEventListener('mouseout', changeOpacity.bind(1));

/////////////////////
// Sticky Navigation

/*
// This method is not efficient
const initialCoord = section1.getBoundingClientRect();

window.addEventListener('scroll', () => {
  if (window.scrollY > initialCoord.top) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
});
*/

/////////////////////
// Sticky Navigation - Intersection Observer API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = entries => {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const stickyNavOptions = {
  root: null,
  rootMargin: `-${navHeight}px`,
  threshold: 0, // A threshold of 1.0 means that when 100% of the target is visible within the element specified by the root option, the callback is invoked.
};

const headerObserver = new IntersectionObserver(stickyNav, stickyNavOptions);
headerObserver.observe(header);

/////////////////////
// Revealing Elements on Scroll
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries; // Since we have only one threshold

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  sectionObserver.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  threshold: 0.15,
  root: null,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

/////////////////////
// Lazy loading Images

const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //Replace src with data-src attribute
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  imgObserver.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});

imgTargets.forEach(img => {
  imgObserver.observe(img);
});

/////////////////////
// Slider

const slider = () => {
  const leftBtn = document.querySelector('.slider__btn--left');
  const rightBtn = document.querySelector('.slider__btn--right');
  const slides = document.querySelectorAll('.slide');
  let curSlide = 0;
  const maxSlide = slides.length;

  const dotContainer = document.querySelector('.dots');

  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.5)';
  // slider.style.overflow = 'visible';

  const createDots = slides => {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide=${i}></button>`
      );
    });
  };
  createDots(slides);

  const dots = document.querySelectorAll('.dots__dot');

  const activateDots = curSlide => {
    dots.forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${curSlide}"]`)
      .classList.add('dots__dot--active');
  };

  activateDots(curSlide);

  slides.forEach((el, i) => {
    el.style.transform = `translateX(${i * 100}%)`;
  });

  const goToSlide = cur => {
    slides.forEach((el, i) => {
      el.style.transform = `translateX(${(i - cur) * 100}%)`;
    });
    activateDots(cur);
  };

  const nextSlide = () => {
    curSlide++;
    if (curSlide > maxSlide - 1) curSlide = 0;
    goToSlide(curSlide);
  };

  const prevSlide = () => {
    curSlide--;
    if (curSlide < 0) curSlide = maxSlide - 1;
    goToSlide(curSlide);
  };

  rightBtn.addEventListener('click', nextSlide);
  leftBtn.addEventListener('click', prevSlide);

  document.addEventListener('keyup', e => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  dotContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      curSlide = e.target.dataset.slide;
      goToSlide(curSlide);
    }
  });
};

slider();
