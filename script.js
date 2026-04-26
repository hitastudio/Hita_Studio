window.onload = () => {

    const wipe = document.getElementById('wipe-in') || document.querySelector('.transition-wipe');
    
    if (wipe) {

        wipe.style.top = '0';
        
        setTimeout(() => {
            wipe.style.top = '-100vh';
        }, 100); 
    }
};

document.querySelectorAll('.transition-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); 
        const targetUrl = this.getAttribute('href');
        
        const wipe = document.getElementById('wipe-in') || document.querySelector('.transition-wipe');

        if (wipe) {
            wipe.style.top = '0'; 
            
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 600);
        } else {
            window.location.href = targetUrl;
        }
    });
});


// SISTEM MOUSE DRAG TO SCROLL (GLOBAL)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.drag-scroll').forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; 
            slider.scrollLeft = scrollLeft - walk;
        });
    });
});