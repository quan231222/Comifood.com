document.addEventListener('DOMContentLoaded', function() {
// 1. Hàm khởi tạo bắt buộc cho Google API
    function googleTranslateElementInit() {
        new google.translate.TranslateElement({
            pageLanguage: 'vi',
            includedLanguages: 'en,vi',
            autoDisplay: false
        }, 'google_translate_element');
    }

    // 2. Tích hợp Script Google API một cách đồng bộ
    (function() {
        var gt = document.createElement('script');
        gt.type = 'text/javascript';
        gt.async = true;
        gt.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(gt, s);
    })();

    // 3. Logic điều khiển Switcher
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'languageSwitcher') {
            e.target.addEventListener('change', function() {
                var lang = this.value;
                var googleCombo = document.querySelector('.goog-te-combo');
                if (googleCombo) {
                    googleCombo.value = lang;
                    googleCombo.dispatchEvent(new Event('change'));
                } else {
                    console.error("Google Translate chưa tải xong, vui lòng đợi 1 giây.");
                }
            });
        }
    });
    
    // main.js
    // --- LOGIC REVEAL ON SCROLL (TỐI ƯU & LẶP LẠI) ---
const initReveal = () => {
    // Chọn tất cả section và các thành phần quan trọng
    const revealElements = document.querySelectorAll('section, .main-categories, .library-slider-container');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Thêm class khi vào tầm mắt
                entry.target.classList.add('active');
            } else {
                // Xóa class khi ra khỏi tầm mắt để lặp lại hiệu ứng khi cuộn ngược lại
                entry.target.classList.remove('active');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px" // Kích hoạt trễ một chút để thấy rõ chuyển động trồi lên
    });

    revealElements.forEach(el => {
        el.classList.add('reveal'); // Đảm bảo mọi section đều có class reveal
        revealObserver.observe(el);
    });
};

// Khởi chạy khi trang đã load hoàn toàn để tính toán vị trí chuẩn xác
window.addEventListener('load', initReveal);
    
    // Xử lý hiệu ứng Shrink Header khi cuộn trang
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 40) {
            header.classList.add('shrunk');
        } else {
            header.classList.remove('shrunk');
        }
    });

    // --- MOBILE MENU LOGIC ---
const menuToggle = document.querySelector('#mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        // Toggle class cho nút 3 gạch
        menuToggle.classList.toggle('is-active');
        // Toggle hiện/ẩn Menu
        navLinks.classList.toggle('is-active');
    });

    // Tự động đóng menu khi click vào một link (để lướt đến section)
    document.querySelectorAll('.nav-links a').forEach(n => n.addEventListener('click', () => {
        menuToggle.classList.remove('is-active');
        navLinks.classList.remove('is-active');
    }));
}
    
    // --- LOGIC CHO HERO SLIDER ---
    const slides = document.querySelectorAll('.slide');
    const btnNext = document.querySelector('.slider-btn.next');
    const btnPrev = document.querySelector('.slider-btn.prev');
    const dotsContainer = document.querySelector('.slider-dots');
    
    let currentSlide = 0;
    const maxSlide = slides.length;
    let autoSlideInterval;

    // 1. Tạo các chấm tròn (dots) dựa trên số lượng slide
    const createDots = function () {
        slides.forEach(function (_, i) {
            dotsContainer.insertAdjacentHTML(
                'beforeend',
                `<div class="dot" data-slide="${i}"></div>`
            );
        });
    };
    createDots();

    // 2. Kích hoạt dấu chấm tương ứng với slide
    const activateDot = function (slide) {
        document
            .querySelectorAll('.dot')
            .forEach(dot => dot.classList.remove('active'));

        document
            .querySelector(`.dot[data-slide="${slide}"]`)
            .classList.add('active');
    };

    // 3. Hàm chuyển slide (Đã cập nhật logic lướt đè)
    const goToSlide = function (slide) {
        // Tìm slide đang hiển thị hiện tại
        const currentActive = document.querySelector('.slide.active');
        
        // Nếu có slide hiện tại, biến nó thành slide cũ (prev) để làm nền
        if (currentActive) {
            slides.forEach(s => s.classList.remove('prev')); // Xóa prev cũ
            currentActive.classList.add('prev');
            currentActive.classList.remove('active');
        } else {
            // Dành cho lần load web đầu tiên (ẩn toàn bộ)
            slides.forEach(s => s.classList.remove('active'));
        }
        
        // Lướt slide mới (active) đè lên
        slides[slide].classList.add('active'); 
        activateDot(slide);
    };

    // 4. Các hàm Next / Prev
    const nextSlide = function () {
        if (currentSlide === maxSlide - 1) {
            currentSlide = 0; // Quay lại slide đầu nếu đang ở cuối
        } else {
            currentSlide++;
        }
        goToSlide(currentSlide);
        resetAutoSlide(); // Reset lại thời gian tự động chạy khi người dùng bấm tay
    };

    const prevSlide = function () {
        if (currentSlide === 0) {
            currentSlide = maxSlide - 1; // Nhảy về cuối nếu đang ở đầu
        } else {
            currentSlide--;
        }
        goToSlide(currentSlide);
        resetAutoSlide();
    };

    // Khởi tạo trạng thái ban đầu
    goToSlide(0);

    // 5. Gắn sự kiện click cho mũi tên
    btnNext.addEventListener('click', nextSlide);
    btnPrev.addEventListener('click', prevSlide);

    // 6. Gắn sự kiện click cho các chấm tròn
    dotsContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('dot')) {
            const slide = e.target.dataset.slide;
            currentSlide = Number(slide);
            goToSlide(currentSlide);
            resetAutoSlide();
        }
    });

    // 7. Chạy tự động (Auto-play) sau mỗi 5 giây
    const startAutoSlide = function() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    };

    const resetAutoSlide = function() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    };

    startAutoSlide();

    // --- LOGIC CHO STORY SECTION ---
    const storyDots = document.querySelectorAll('.story-dots .story-dot');
    const storyItems = document.querySelectorAll('.story-item');
    const storyImages = document.querySelectorAll('.story-image img');
    
    let currentStoryIndex = 0;

    function switchStory(newIndex) {
        // Prevent switching to same slide
        if (newIndex === currentStoryIndex) return;
        
        const direction = newIndex > currentStoryIndex ? 'next' : 'prev';
        
        // Find currently active items
        const activeItem = document.querySelector('.story-item.active');
        const activeImage = document.querySelector('.story-image img.active');
        
        // Remove active class from all dots
        storyDots.forEach(d => d.classList.remove('active'));
        
        // Add exit animation to current items based on direction
        if (activeItem) {
            activeItem.classList.remove('active');
            if (direction === 'next') {
                activeItem.classList.add('exit-left');
            } else {
                activeItem.classList.add('exit-right');
            }
            
            // Remove exit class after animation completes
            setTimeout(() => {
                activeItem.classList.remove('exit-left', 'exit-right');
            }, 600);
        }
        
        if (activeImage) {
            activeImage.classList.remove('active');
            if (direction === 'next') {
                activeImage.classList.add('exit-left');
            } else {
                activeImage.classList.add('exit-right');
            }
            
            setTimeout(() => {
                activeImage.classList.remove('exit-left', 'exit-right');
            }, 600);
        }
        
        // Add active class to new items after a brief delay for smooth transition
        setTimeout(() => {
            if (storyItems[newIndex]) {
                storyItems[newIndex].classList.add('active');
                if (direction === 'next') {
                    storyItems[newIndex].classList.add('enter-right');
                } else {
                    storyItems[newIndex].classList.add('enter-left');
                }
            }
            
            if (storyImages[newIndex]) {
                storyImages[newIndex].classList.add('active');
                if (direction === 'next') {
                    storyImages[newIndex].classList.add('enter-right');
                } else {
                    storyImages[newIndex].classList.add('enter-left');
                }
            }
        }, 50);
        
        // Add active class to current dot
        storyDots[newIndex].classList.add('active');
        
        // Update current index
        currentStoryIndex = newIndex;
    }

    storyDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            switchStory(index);
        });
    });

    const libTrack = document.getElementById('libraryTrack');
    const libCards = document.querySelectorAll('.library-card');
    const libPrev = document.querySelector('.lib-btn.prev');
    const libNext = document.querySelector('.lib-btn.next');

    let libIndex = 2; // Bắt đầu ở ảnh giữa

    function updateLibrary() {
        libCards.forEach((card, i) => {
            card.classList.toggle('active', i === libIndex);
        });

        const cardWidth = libCards[0].offsetWidth + 30; // Width + Gap
        const offset = -(libIndex * cardWidth) + (window.innerWidth / 2.5);
        libTrack.style.transform = `translateX(${offset}px)`;
    }

    libNext.addEventListener('click', () => {
        if (libIndex < libCards.length - 1) {
            libIndex++;
            updateLibrary();
        }
    });

    libPrev.addEventListener('click', () => {
        if (libIndex > 0) {
            libIndex--;
            updateLibrary();
        }
    });

// Khởi tạo vị trí đầu tiên
window.addEventListener('load', updateLibrary);

    // --- INFINITE LOGO LOOP JS ---
    const track = document.getElementById('partnersTrack');
    if (track) {
        // 1. Chỉ nhân bản 1 lần duy nhất (tổng là 2 set 7 logo)
        const originalContent = track.innerHTML;
        track.innerHTML = originalContent + originalContent;

        const startAnimation = () => {
            // 2. Tính toán chính xác độ rộng của 1 set logo + 1 cái gap cuối cùng
            // Đây là "điểm chạm" để reset mà không bị giật
            const firstSet = track.children;
            const gap = parseInt(window.getComputedStyle(track).gap);
            
            let totalWidth = 0;
            for (let i = 0; i < firstSet.length / 2; i++) {
                totalWidth += firstSet[i].offsetWidth + gap;
            }

            // 3. Gán biến CSS để Animation sử dụng
            track.style.setProperty('--scroll-distance', `-${totalWidth}px`);
            
            // 4. Kích hoạt animation bằng CSS (linear giúp trôi đều không khựng)
            track.style.animation = `scrollPartners 20s linear infinite`;
        };

        // Đợi ảnh load xong để tính Width chuẩn nhất
        window.addEventListener('load', startAnimation);

        // Tạm dừng khi hover
        track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
        track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
    }
    
});