document.addEventListener('DOMContentLoaded', () => {

    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.querySelector('nav ul');
    const bars = document.querySelectorAll('.bar');

    if (!mobileMenu || !navList) return;

    mobileMenu.addEventListener('click', () => {
        navList.classList.toggle('active');
        mobileMenu.classList.toggle('is-active');

        if (mobileMenu.classList.contains('is-active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            resetBars();
        }
    });

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            mobileMenu.classList.remove('is-active');
            resetBars();
        });
    });

    function resetBars() {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }

});
