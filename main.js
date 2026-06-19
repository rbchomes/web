const nav = document.querySelector('nav');

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
  lerp: 0.15,
  smoothWheel: true,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Scroll event listener for navigation styling
window.addEventListener('scroll', () => {
  if (nav) {
    if (window.scrollY > 80) {
      nav.classList.add('bg-alabaster/95', 'backdrop-blur-md', 'py-4', 'scrolled');
      nav.classList.remove('bg-transparent', 'py-6');
    } else {
      nav.classList.remove('bg-alabaster/95', 'backdrop-blur-md', 'py-4', 'scrolled');
      nav.classList.add('bg-transparent', 'py-6');
    }
  }
}, { passive: true });

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor Implementation
const pathDot = 'M 12 12 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0';
const pathArrowRight = 'M 6 4 L 14 12 L 6 20 L 10 12 Z';
const pathCircle = 'M 12 12 m -10 0 a 10 10 0 1 0 20 0 a 10 10 0 1 0 -20 0';

const cursorSvg = document.querySelector('.custom-cursor-svg');
const cursorPath = document.querySelector('.custom-cursor-path');

if (cursorSvg && cursorPath) {
  const mouse = { x: -24, y: -24 };
  const pos = { x: -24, y: -24, vx: 0, vy: 0 };
  const ease = 0.15;
  const threshold = 8;

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX - 12;
    mouse.y = e.clientY - 12;

    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;
    const vel = Math.hypot(dx, dy);

    const isInteractive = e.target.closest('a, button, [data-hover], .accordion-row, .testimonial-nav-btn');

    if (vel > threshold) {
      if (isInteractive) {
        gsap.to(cursorPath, { attr: { d: pathArrowRight }, duration: 0.3, ease: 'power2.out' });
        gsap.to(cursorSvg, { scale: 2.5, duration: 0.3, ease: 'power2.out' });
      } else {
        gsap.to(cursorPath, { attr: { d: pathArrowRight }, duration: 0.3, ease: 'power2.out' });
        gsap.to(cursorSvg, { scale: 1, duration: 0.3, ease: 'power2.out' });
      }
    } else {
      if (isInteractive) {
        gsap.to(cursorPath, { attr: { d: pathCircle }, duration: 0.3, ease: 'power2.out' });
        gsap.to(cursorSvg, { scale: 1.5, duration: 0.3, ease: 'power2.out' });
      } else {
        gsap.to(cursorPath, { attr: { d: pathDot }, duration: 0.3, ease: 'power2.out' });
        gsap.to(cursorSvg, { scale: 1, duration: 0.3, ease: 'power2.out' });
      }
    }
  });

  gsap.ticker.add(() => {
    pos.vx = (mouse.x - pos.x) * ease;
    pos.vy = (mouse.y - pos.y) * ease;
    pos.x += pos.vx;
    pos.y += pos.vy;
    const angle = Math.atan2(pos.vy, pos.vx) * (180 / Math.PI);
    cursorSvg.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${angle}deg)`;
  });
}

// Navigation Bar Selectors
const navBrand = document.querySelector('.nav-logo-img');
const navLinks = document.querySelectorAll('.nav-link-item');
const navBtn = document.querySelector('.nav-signin-btn');
const mobileMenuBtnLines = document.querySelectorAll('.mobile-menu-btn span');

// New Luxury Hero Scroll Trigger Animation
const newHeroSection = document.querySelector('.luxury-hero');
const newHeroBg = document.querySelector('.luxury-hero-bg');
const newHeroTitle = document.querySelector('.luxury-hero-title');
const newHeroRightBlock = document.querySelector('.luxury-hero-right');

if (newHeroSection) {
  // 1. Initial entry fade & zoom on page load (deferred if preloader exists)
  const triggerEntrance = () => {
    if (newHeroBg) {
      gsap.fromTo(newHeroBg,
        { scale: 1.1, opacity: 0 },
        { scale: 1.0, opacity: 1, duration: 2.2, ease: 'power2.out' }
      );
    }

    if (newHeroTitle || newHeroRightBlock) {
      gsap.fromTo([newHeroTitle, newHeroRightBlock].filter(Boolean),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.6, stagger: 0.25, ease: 'power3.out', delay: 0.2 }
      );
    }
  };

  if (document.getElementById('preloader')) {
    window.addEventListener('preloaderComplete', triggerEntrance);
  } else {
    triggerEntrance();
  }

  // 2. Scroll-scrub parallax timeline
  const newHeroTl = gsap.timeline({
    scrollTrigger: {
      trigger: newHeroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true
    }
  });

  if (newHeroBg) {
    newHeroTl.to(newHeroBg, { y: '25%', scale: 1.05, ease: 'none' }, 0);
  }
  
  if (newHeroTitle) {
    newHeroTl.to(newHeroTitle, { y: '-40%', opacity: 0, ease: 'none' }, 0);
  }
  
  if (newHeroRightBlock) {
    newHeroTl.to(newHeroRightBlock, { y: '-60%', opacity: 0, ease: 'none' }, 0);
  }
}

// Manifesto Section Word Stagger
const manifestoText = document.querySelector('.manifesto-text');
if (manifestoText) {
  const text1 = "A home isn't just square footage. It is your architectural legacy.";
  const text2 = "We build ultra-premium villas and luxury flats in Trivandrum, blending modern infrastructure with soul.";
  
  const wrapWords = (str, isGray) => {
    return str.split(' ').map(word => `<span class="word inline-block mr-[0.3em] ${isGray ? 'text-cool-gray' : 'text-charcoal'}">${word}</span>`).join('');
  };
  
  manifestoText.innerHTML = `
    <span class="block mb-4">${wrapWords(text1, false)}</span>
    <span class="block">${wrapWords(text2, true)}</span>
  `;
  
  const words = manifestoText.querySelectorAll('.word');
  gsap.fromTo(
    words,
    { opacity: 0.2 },
    {
      opacity: 1,
      stagger: 0.05,
      ease: 'none',
      scrollTrigger: {
        trigger: '.manifesto-section',
        start: 'top 80%',
        end: 'bottom 40%',
        scrub: 1,
      },
    }
  );
}

// Horizontal Gallery Section Scroll-Jacking
const horizontalSection = document.querySelector('.horizontal-section');
const horizontalTrack = document.querySelector('.horizontal-track');
if (horizontalSection && horizontalTrack) {
  let mm = gsap.matchMedia();
  mm.add("(min-width: 1024px)", () => {
    const scrollWidth = horizontalTrack.scrollWidth - window.innerWidth;
    gsap.to(horizontalTrack, {
      x: -scrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: horizontalSection,
        start: 'top top',
        end: () => `+=${scrollWidth}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
  });
}

// Homepage Featured Projects Section Entrance
const projectsHomeSection = document.querySelector('.home-projects-section');
if (projectsHomeSection) {
  gsap.fromTo(
    projectsHomeSection.querySelectorAll('.editorial-h2, .label-text'),
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: projectsHomeSection,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    }
  );

  gsap.fromTo(
    projectsHomeSection.querySelectorAll('.project-card'),
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: projectsHomeSection,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    }
  );
}

// Philosophy Section Entrance
const philSection = document.querySelector('.philosophy-section');
if (philSection) {
  gsap.fromTo(
    philSection.querySelectorAll('.animate-in'),
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: philSection,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    }
  );
}

// Process Section Step Entrance
const procSection = document.querySelector('.process-section');
if (procSection) {
  const steps = procSection.querySelectorAll('.step-item');
  steps.forEach((step, i) => {
    gsap.fromTo(
      step,
      { x: 40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        delay: i * 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: step,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
  const leftSticky = procSection.querySelector('.left-sticky');
  if (leftSticky) {
    gsap.fromTo(
      leftSticky,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: procSection,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      }
    );
  }
}

// Careers Section Entrance
const careersSection = document.querySelector('.careers-section');
if (careersSection) {
  gsap.fromTo(
    careersSection.querySelectorAll('.animate-in'),
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: careersSection,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    }
  );
}

// Testimonials Section Entrance
const testSection = document.querySelector('.testimonials-section');
if (testSection) {
  gsap.fromTo(
    testSection.querySelectorAll('.animate-in'),
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: testSection,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    }
  );
}

// Services Accordion Entrance
const servSection = document.querySelector('.services-accordion-section');
if (servSection) {
  gsap.fromTo(
    servSection.querySelectorAll('.animate-in'),
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: servSection,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    }
  );
}

// Support Grid Card Entrance
const supportSection = document.querySelector('.support-grid-section');
if (supportSection) {
  gsap.fromTo(
    supportSection.querySelectorAll('.support-card'),
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: supportSection,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    }
  );
}

// Blog Section Item Entrance
const blogSection = document.querySelector('.blog-section');
if (blogSection) {
  gsap.fromTo(
    blogSection.querySelectorAll('.blog-item'),
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: blogSection,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    }
  );
}

// CTA Section Entrance
const ctaSection = document.querySelector('.cta-section');
if (ctaSection) {
  gsap.fromTo(
    ctaSection.querySelectorAll('.animate-in'),
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: ctaSection,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    }
  );
}

// Testimonial Data & Slider Functionality
const testimonials = [
  {
    id: 1,
    quote: "Rbchomes delivered our signature villa in Trivandrum exactly on schedule. The structural concrete build-quality is absolutely flawless, and the architectural design perfectly captures the essence of tropical luxury. Truly premium builders.",
    author: 'ARAVIND MUKUNDAN',
    rating: 5,
  },
  {
    id: 2,
    quote: "Purchasing our luxury flat was a seamless experience. The automated home ecosystems, premium sanitary fittings, and panoramic views of the city skyline make everyday living feel like a high-end resort. Highly recommended!",
    author: 'MEERA & RAJESH NAIR',
    rating: 5,
  },
  {
    id: 3,
    quote: "From consultation to blueprinting and final handover, the team at Rbchomes maintained absolute transparency. Their attention to detail in construction, plumbing, and structural aesthetics is unmatched in Kerala.",
    author: 'DR. SANDEEP KURUP',
    rating: 5,
  },
  {
    id: 4,
    quote: "The landscaping, private pool area, and high-quality premium finishes in our villa are top-notch. It's incredibly hard to find builder-centric custom architecture executed with such precision. A masterclass in luxury.",
    author: 'ANJALI MENON',
    rating: 5,
  },
  {
    id: 5,
    quote: "Rbchomes stands out for their absolute legal clearance and tier-1 construction standards. The property appreciation has exceeded our expectations, and the handover was handled with utter mastery.",
    author: 'THOMAS ZACHARIAH',
    rating: 5,
  },
];

let activeTestimonialIndex = 0;
const quoteContainer = document.querySelector('.testimonial-quote-container');
const authorName = document.querySelector('.testimonial-author-name');
const ratingContainer = document.querySelector('.testimonial-rating-container');
const testimonialButtons = document.querySelectorAll('.testimonial-nav-btn');
const testimonialImage = document.querySelector('.testimonial-image');

function updateTestimonial(index) {
  activeTestimonialIndex = index;
  
  // Update active button state
  testimonialButtons.forEach((btn, i) => {
    if (i === index) {
      btn.classList.add('border-charcoal', 'bg-charcoal', 'text-white');
      btn.classList.remove('border-charcoal/20', 'text-charcoal/50');
    } else {
      btn.classList.remove('border-charcoal', 'bg-charcoal', 'text-white');
      btn.classList.add('border-charcoal/20', 'text-charcoal/50');
    }
  });

  // Fade transition on quote container
  if (quoteContainer && authorName && ratingContainer) {
    const timeline = gsap.timeline();
    timeline.to([quoteContainer, authorName, ratingContainer], { opacity: 0, y: 10, duration: 0.2, ease: 'power2.in' })
      .add(() => {
        const item = testimonials[index];
        quoteContainer.textContent = `"${item.quote}"`;
        authorName.textContent = item.author;
        
        let starsHtml = '';
        for (let i = 0; i < item.rating; i++) {
          starsHtml += `<svg class="w-4 h-4 text-charcoal" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
        }
        ratingContainer.innerHTML = starsHtml;
      })
      .to([quoteContainer, authorName, ratingContainer], { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
  }

  if (testimonialImage) {
    gsap.fromTo(
      testimonialImage,
      { opacity: 0, scale: 1.02 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
    );
  }
}

testimonialButtons.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    updateTestimonial(i);
  });
});

// Services Accordion Interaction (Hover Expand)
const accordionRows = document.querySelectorAll('.accordion-row');
accordionRows.forEach((row) => {
  const arrow = row.querySelector('.accordion-arrow');
  const content = row.querySelector('.accordion-content');
  const video = row.querySelector('.accordion-bg-video');
  
  if (video) {
    video.setAttribute('muted', '');
    video.defaultMuted = true;
    video.muted = true;
  }
  
  row.addEventListener('mouseenter', () => {
    content.classList.remove('max-h-0', 'opacity-0');
    content.classList.add('max-h-64', 'opacity-100', 'pb-8');
    
    arrow.classList.remove('text-white/30', '-translate-x-2', 'opacity-50');
    arrow.classList.add('text-white', 'translate-x-0', 'opacity-100');
    
    if (video) {
      video.play().catch((err) => {
        console.log("Video playback deferred/blocked:", err);
      });
    }
  });
  
  row.addEventListener('mouseleave', () => {
    content.classList.add('max-h-0', 'opacity-0');
    content.classList.remove('max-h-64', 'opacity-100', 'pb-8');
    
    arrow.classList.add('text-white/30', '-translate-x-2', 'opacity-50');
    arrow.classList.remove('text-white', 'translate-x-0', 'opacity-100');
  });
});

// Mobile Menu Toggle Logic
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
const mobileMenuLinks = document.querySelectorAll('.mobile-nav-link');

if (mobileMenuBtn && mobileMenuOverlay) {
  let isMenuOpen = false;
  
  mobileMenuBtn.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    const lines = mobileMenuBtn.querySelectorAll('span');
    
    if (lines.length >= 2) {
      if (isMenuOpen) {
        gsap.to(lines[0], { y: 4, rotate: 45, duration: 0.3, ease: 'power2.out' });
        gsap.to(lines[1], { y: -4, rotate: -45, duration: 0.3, ease: 'power2.out' });
        
        mobileMenuOverlay.classList.remove('pointer-events-none');
        gsap.to(mobileMenuOverlay, { opacity: 1, duration: 0.5, ease: 'power2.out' });
        
        if (mobileMenuLinks.length > 0) {
          gsap.fromTo(mobileMenuLinks, 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.2, ease: 'power2.out' }
          );
        }
        if (typeof lenis !== 'undefined') lenis.stop();
      } else {
        gsap.to(lines[0], { y: 0, rotate: 0, duration: 0.3, ease: 'power2.out' });
        gsap.to(lines[1], { y: 0, rotate: 0, duration: 0.3, ease: 'power2.out' });
        
        mobileMenuOverlay.classList.add('pointer-events-none');
        gsap.to(mobileMenuOverlay, { opacity: 0, duration: 0.5, ease: 'power2.inOut' });
        if (typeof lenis !== 'undefined') lenis.start();
      }
    }
  });

  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      isMenuOpen = false;
      mobileMenuOverlay.classList.add('pointer-events-none');
      gsap.to(mobileMenuOverlay, { opacity: 0, duration: 0.3, ease: 'power2.inOut' });
      
      const lines = mobileMenuBtn.querySelectorAll('span');
      if (lines.length >= 2) {
        gsap.to(lines[0], { y: 0, rotate: 0, duration: 0.3, ease: 'power2.out' });
        gsap.to(lines[1], { y: 0, rotate: 0, duration: 0.3, ease: 'power2.out' });
      }
      if (typeof lenis !== 'undefined') lenis.start();
    });
  });
}

// Projects Gallery Filtering Logic
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterButtons.length > 0 && projectCards.length > 0) {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active classes
      filterButtons.forEach(b => b.classList.remove('bg-charcoal', 'text-white'));
      filterButtons.forEach(b => b.classList.add('border-charcoal/20', 'text-charcoal/50'));
      btn.classList.remove('border-charcoal/20', 'text-charcoal/50');
      btn.classList.add('bg-charcoal', 'text-white');
      
      const filterValue = btn.getAttribute('data-filter');
      
      // Animate filter change
      gsap.to(projectCards, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filterValue === 'all' || category === filterValue) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          });
          
          // Fade in filtered list
          const visibleCards = Array.from(projectCards).filter(c => c.style.display === 'block');
          if (visibleCards.length > 0) {
            gsap.fromTo(visibleCards, 
              { opacity: 0, scale: 0.95 },
              { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
            );
          }
        }
      });
    });
  });
}

// Booking Page Multi-Step Wizard Logic
const wizardContainer = document.querySelector('.booking-wizard');
if (wizardContainer) {
  const steps = wizardContainer.querySelectorAll('.wizard-step');
  const stepIndicators = wizardContainer.querySelectorAll('.step-indicator');
  const nextBtns = wizardContainer.querySelectorAll('.wizard-next-btn');
  const prevBtns = wizardContainer.querySelectorAll('.wizard-prev-btn');
  const unitCards = wizardContainer.querySelectorAll('.unit-type-card');
  const submitBtn = wizardContainer.querySelector('.wizard-submit-btn');
  const successScreen = wizardContainer.querySelector('.wizard-success-screen');
  
  let currentStep = 0;
  let selectedUnitType = '';
  
  // Interactive cards click
  unitCards.forEach(card => {
    card.addEventListener('click', () => {
      unitCards.forEach(c => c.classList.remove('border-charcoal', 'shadow-lg', 'bg-charcoal/5'));
      unitCards.forEach(c => c.classList.add('border-charcoal/10'));
      card.classList.remove('border-charcoal/10');
      card.classList.add('border-charcoal', 'shadow-lg', 'bg-charcoal/5');
      selectedUnitType = card.getAttribute('data-type');
      
      // Auto advance after short delay
      setTimeout(() => {
        navigateStep(1);
      }, 400);
    });
  });
  
  function navigateStep(direction) {
    const targetStep = currentStep + direction;
    if (targetStep < 0 || targetStep >= steps.length) return;
    
    // Animate out current step
    gsap.to(steps[currentStep], {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        steps[currentStep].classList.add('hidden');
        steps[targetStep].classList.remove('hidden');
        
        // Animate in target step
        gsap.fromTo(steps[targetStep],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
        
        currentStep = targetStep;
        updateIndicators();
      }
    });
  }
  
  function updateIndicators() {
    stepIndicators.forEach((indicator, idx) => {
      if (idx <= currentStep) {
        indicator.classList.remove('bg-charcoal/10', 'text-charcoal/40');
        indicator.classList.add('bg-charcoal', 'text-white');
      } else {
        indicator.classList.add('bg-charcoal/10', 'text-charcoal/40');
        indicator.classList.remove('bg-charcoal', 'text-white');
      }
    });
  }
  
  nextBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateStep(1);
    });
  });
  
  prevBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateStep(-1);
    });
  });
  
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Simple validation check
      const inputs = steps[currentStep].querySelectorAll('input[required]');
      let isValid = true;
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('border-red-500');
        } else {
          input.classList.remove('border-red-500');
        }
      });
      
      if (!isValid) return;
      
      // Submit animation
      gsap.to(steps[currentStep], {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: () => {
          steps[currentStep].classList.add('hidden');
          if (successScreen) {
            successScreen.classList.remove('hidden');
            gsap.fromTo(successScreen,
              { opacity: 0, scale: 0.95 },
              { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
            );
            
            const checkmarkPath = successScreen.querySelector('.checkmark-path');
            if (checkmarkPath) {
              gsap.fromTo(checkmarkPath,
                { strokeDashoffset: 100, strokeDasharray: 100 },
                { strokeDashoffset: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' }
              );
            }
          }
        }
      });
    });
  }
}

// Contact Form Interactions
const contactInputs = document.querySelectorAll('.contact-input');
contactInputs.forEach(input => {
  const container = input.parentElement;
  const label = container.querySelector('label');
  
  input.addEventListener('focus', () => {
    if (label) {
      gsap.to(label, { y: -20, scale: 0.85, color: '#1a1a1a', duration: 0.2, ease: 'power2.out' });
    }
  });
  
  input.addEventListener('blur', () => {
    if (!input.value.trim() && label) {
      gsap.to(label, { y: 0, scale: 1, color: '#8c8c8c', duration: 0.2, ease: 'power2.out' });
    }
  });
});
