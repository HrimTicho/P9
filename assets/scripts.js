let currentSlide = 0;
let autoSlideInterval;
let currentTag = 'Tous';
const slides = document.querySelectorAll(".carousel-item");
const indicators = document.querySelectorAll(".carousel-indicators button");
const galleryItems = document.querySelectorAll('.gallery-item');
const totalSlides = slides.length;

function startAutoSlide() {
    if (!autoSlideInterval) {
        autoSlideInterval = setInterval(nextSlide, 4000);
    }
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

function updateIndicators(slideIndex) {
    indicators.forEach(indicator => indicator.classList.remove("active"));
    indicators[slideIndex].classList.add("active");
}

function showSlide(slideIndex) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[slideIndex].classList.add("active");
    updateIndicators(slideIndex);
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
    resetAutoSlide();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
    resetAutoSlide();
}

function moveToSlide(slideIndex) {
    currentSlide = slideIndex;
    showSlide(currentSlide);
    resetAutoSlide();
}

function resetAutoSlide() {
    if (autoSlideInterval) {
        stopAutoSlide();
    }
    autoSlideInterval = setTimeout(nextSlide, 4000);
}

function filterImages(tag) {
    stopAutoSlide(); 
    currentTag = tag;
    galleryItems.forEach(image => {
        image.style.display = (image.dataset.galleryTag === tag || tag === 'Tous') ? 'block' : 'none';
    });
    startAutoSlide(); 
}

function openLightbox(index) {
    stopAutoSlide(); 
    const src = galleryItems[index].src;
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');
    lightbox.innerHTML = `
        <span class="lightbox-arrow" onclick="changeSlide(-1)">&#10094;</span>
        <img src="${src}" class="lightbox-img">
        <span class="lightbox-arrow" onclick="changeSlide(1)">&#10095;</span>
    `;
    document.body.appendChild(lightbox);
    lightbox.style.display = 'flex';
    lightbox.addEventListener('click', e => {
        if (e.target !== e.currentTarget) return;
        lightbox.remove();
        startAutoSlide(); 
    });
}

function changeSlide(direction) {
    const filteredImages = Array.from(galleryItems).filter(img => img.style.display === 'block');
    let displayedIndex = filteredImages.indexOf(galleryItems[currentSlide]);
    displayedIndex += direction;
    if (displayedIndex < 0) displayedIndex = filteredImages.length - 1;
    if (displayedIndex >= filteredImages.length) displayedIndex = 0;
    const newImage = filteredImages[displayedIndex];
    currentSlide = Array.from(galleryItems).indexOf(newImage);
    const lightboxImg = document.querySelector('.lightbox img');
    lightboxImg.src = newImage.src;
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('gallery-item')) {
        const index = Array.from(galleryItems).indexOf(e.target);
        openLightbox(index);
    }
});

document.addEventListener("DOMContentLoaded", function() {
    filterImages(currentTag); 
    startAutoSlide(); 
});
