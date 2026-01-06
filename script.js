
  // -----------------------------
  // Drawer functionality
  // -----------------------------
  const drawer = document.getElementById('drawer');
  const menuBtn = document.getElementById('menuBtn');
  const closeDrawer = document.getElementById('closeDrawer');

  function openDrawer() {
    drawer.classList.add('active');
    menuBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function hideDrawer() {
    drawer.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', openDrawer);
  closeDrawer.addEventListener('click', hideDrawer);
  drawer.addEventListener('click', (e) => { if (e.target === drawer) hideDrawer(); });

  // -----------------------------
  // Smooth scroll for in-page links
  // -----------------------------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        e.preventDefault();
        hideDrawer();
        document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

 

  // -----------------------------
  // Animate Sponsors Grid
  // -----------------------------
  gsap.utils.toArray('.sponsor-logos-container img').forEach((logo, i) => {
    gsap.to(logo, {
      scrollTrigger: { trigger: logo, start: "top 85%" },
      opacity: 1,
      y: 0,
      duration: 1,
      delay: i * 0.2,
      ease: "power3.out"
    });
  });
  // Horizontal scrolling for mobile rows
// Mobile horizontal scroll animation
if (window.innerWidth <= 480) {
  document.querySelectorAll(".mobile-only .sponsor-row").forEach((row, index) => {
    // Duplicate content for seamless scroll
    row.innerHTML += row.innerHTML;

    const totalWidth = row.scrollWidth / 2; // width of original logos
    const direction = index % 2 === 0 ? 1 : -1; // alternate directions

    gsap.to(row, {
      x: direction * -totalWidth,
      duration: 20,  // adjust speed here
      repeat: -1,
      ease: "linear"
    });
  });
}


  // -----------------------------
  // Cursor gradient effect
  // -----------------------------
  const gradientBg = document.getElementById("gradient-bg");
  if (gradientBg) {
    document.addEventListener("mousemove", (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) * 100;
      const y = (e.clientY / innerHeight) * 100;
      gradientBg.style.background = `
        radial-gradient(
          circle at ${x}% ${y}%,
          rgba(255, 182, 193, 0.4),
          rgba(147, 112, 219, 0.3),
          rgba(135, 206, 250, 0.2),
          rgba(26, 26, 26, 1)
        )
      `;
    });
  }

const video = document.getElementById('heroVideo');
const homeSection = document.getElementById('home');

// Function to play video from start
function playHomeVideo() {
  video.currentTime = 0; // start from beginning
  video.play().catch(err => {
    console.log("Video play failed:", err);
  });
}

// Example: if you are using buttons or links to navigate
const navLinks = document.querySelectorAll('nav a'); // adjust selector as needed
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    setTimeout(() => {
      if (homeSection.offsetParent !== null) { // checks if visible
        playHomeVideo();
      }
    }, 50); // slight delay to allow display changes
  });
});


