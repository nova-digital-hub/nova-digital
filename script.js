// NOVA site interactions
document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");
    const menuButton = document.getElementById("menuButton");
    const mobileMenu = document.getElementById("mobileMenu");

    // Mobil menüyü aç/kapat
    if (menuButton && mobileMenu) {
        menuButton.addEventListener("click", () => {
            const active = mobileMenu.classList.toggle("active");
            menuButton.setAttribute("aria-expanded", String(active));
            const icon = menuButton.querySelector("i");
            if (icon) icon.className = active ? "ri-close-line" : "ri-menu-3-line";
        });

        mobileMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("active");
                menuButton.setAttribute("aria-expanded", "false");
                const icon = menuButton.querySelector("i");
                if (icon) icon.className = "ri-menu-3-line";
            });
        });
    }

    // Navbar scroll efekti
    const updateNavbar = () => {
        if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 30);
    };
    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });

    // Scroll reveal
    const revealItems = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealItems.forEach(item => observer.observe(item));
    } else {
        revealItems.forEach(item => item.classList.add("visible"));
    }

    // İstatistik sayaçları
    const counters = document.querySelectorAll(".stat strong[data-target]");
    const animateCounter = element => {
        const target = Number(element.dataset.target);
        if (!Number.isFinite(target)) return;
        const duration = 1200;
        const start = performance.now();

        const step = now => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = Math.round(target * eased);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
        const counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(counter => counterObserver.observe(counter));
    } else {
        counters.forEach(counter => counter.textContent = counter.dataset.target);
    }

    // SSS akordeon
    document.querySelectorAll(".faq-question").forEach(question => {
        question.addEventListener("click", () => {
            const item = question.closest(".faq-item");
            const answer = item?.querySelector(".faq-answer");
            if (!item || !answer) return;

            const willOpen = !item.classList.contains("active");

            document.querySelectorAll(".faq-item.active").forEach(openItem => {
                if (openItem !== item) {
                    openItem.classList.remove("active");
                    const openAnswer = openItem.querySelector(".faq-answer");
                    const openButton = openItem.querySelector(".faq-question");
                    if (openAnswer) openAnswer.style.maxHeight = null;
                    if (openButton) openButton.setAttribute("aria-expanded", "false");
                }
            });

            item.classList.toggle("active", willOpen);
            question.setAttribute("aria-expanded", String(willOpen));
            answer.style.maxHeight = willOpen ? `${answer.scrollHeight}px` : null;
        });
    });

    // Masaüstü özel imleç
    const cursor = document.querySelector(".cursor");
    const follower = document.querySelector(".cursor-follower");

    if (cursor && follower && window.matchMedia("(pointer: fine)").matches) {
        let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

        window.addEventListener("mousemove", event => {
            mouseX = event.clientX;
            mouseY = event.clientY;
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        }, { passive: true });

        const animateFollower = () => {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;
            requestAnimationFrame(animateFollower);
        };
        animateFollower();

        document.querySelectorAll("a, button").forEach(element => {
            element.addEventListener("mouseenter", () => follower.classList.add("active"));
            element.addEventListener("mouseleave", () => follower.classList.remove("active"));
        });
    }

    // Placeholder # bağlantılarının sayfayı yukarı zıplatmasını engelle
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener("click", event => event.preventDefault());
    });
});
