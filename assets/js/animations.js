const heroTitle = document.querySelector('.page-hero h1');
if (heroTitle) {
    heroTitle.innerHTML = heroTitle.textContent
        .split(' ')
        .map(word => `<span class="word">${word}</span>`)
        .join(' ');
}

const animatedWords = document.querySelectorAll('.page-hero .word');
animatedWords.forEach((word, idx) => {
    word.style.opacity = '0';
    word.style.display = 'inline-block';
    word.style.transform = 'translateY(18px)';
    word.style.transition = `opacity 0.55s ease ${idx * 0.06}s, transform 0.55s ease ${idx * 0.06}s`;
});

window.addEventListener('load', () => {
    animatedWords.forEach((word) => {
        word.style.opacity = '1';
        word.style.transform = 'translateY(0)';
    });
});
