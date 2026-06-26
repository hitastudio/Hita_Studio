
let currentPageGames = 1;
let currentPageVlogs = 1;
let currentPagePencapaian = 1;

function getItemsPerPage() {
    const width = window.innerWidth;
    if (width < 640) return 2;    
    if (width < 1024) return 4;    
    return 6;                      
}

let itemsPerPage = getItemsPerPage();

window.addEventListener('resize', () => {
    let newItems = getItemsPerPage();
    if (newItems !== itemsPerPage) {
        itemsPerPage = newItems;
        currentPageGames = 1;
        currentPageVlogs = 1;
        currentPagePencapaian = 1;
        
        renderGames();
        renderVlogFiltered();
        renderPencapaian();
    }
});
window.onload = () => {
    renderHeroSlider(); 
    renderGames();
    updateGameDropdowns();
    renderVlogFiltered();
    renderPencapaian();
    renderCrowdfunding(); 

    const btnMenuOpen = document.getElementById('mobile-menu-btn');
    const btnMenuClose = document.getElementById('close-menu-btn');
    const drawer = document.getElementById('mobile-menu-drawer');
    const backdrop = document.getElementById('mobile-menu-backdrop');
    const navLinks = document.querySelectorAll('.mobile-nav-link');

    function openMobileMenu() {
        backdrop.classList.remove('hidden');
        setTimeout(() => backdrop.classList.remove('opacity-0'), 10);
        drawer.classList.remove('translate-x-full');
        drawer.classList.add('translate-x-0');
    }

    function closeMobileMenu() {
        drawer.classList.remove('translate-x-0');
        drawer.classList.add('translate-x-full');
        backdrop.classList.add('opacity-0');
        setTimeout(() => backdrop.classList.add('hidden'), 300);
    }

    if (btnMenuOpen && drawer && backdrop && btnMenuClose) {
        btnMenuOpen.addEventListener('click', openMobileMenu);
        
        btnMenuClose.addEventListener('click', closeMobileMenu);
        backdrop.addEventListener('click', closeMobileMenu);

        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
};

function renderHeroSlider() {
    const container = document.getElementById('hero-slider-container');
    const titleEl = document.getElementById('hero-title');
    const descEl = document.getElementById('hero-desc');
    const btnPlay = document.getElementById('hero-btn-play');
    const btnDevlog = document.getElementById('hero-btn-devlog');
    const platformsEl = document.getElementById('hero-platforms');

    if (!container || !siteData.games || siteData.games.length === 0) return;

    const featuredGames = siteData.games;

    let imgElements = '';
    featuredGames.forEach((img) => {
        imgElements += `<img src="${img.gambar}" alt="${img.judul}" class="slide-card card-hidden" onerror="this.src='https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800'">`;
    });
    container.innerHTML = imgElements;

    const slides = document.querySelectorAll('.slide-card');
    let currentIndex = 0;
    let autoSlideInterval;

    function updateContent(index) {
        const data = featuredGames[index];
        
        titleEl.style.opacity = 0;
        descEl.style.opacity = 0;
        if(platformsEl) platformsEl.style.opacity = 0;
        
        setTimeout(() => {
            const words = data.judul.split(' ');
            const lastWord = words.pop();
            const restOfTitle = words.join(' ');

            titleEl.innerHTML = `${restOfTitle} <br><span class="text-brand-500 relative inline-block">${lastWord}
                <svg class="absolute w-full h-3 -bottom-1 left-0 text-brand-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="8" fill="none"/></svg>
            </span>`;
            
            descEl.innerText = data.deskripsi;
            
            if (data.link && data.link !== "#") {
                btnPlay.href = data.link;
                btnPlay.style.display = "flex";
            } else {
                btnPlay.style.display = "none"; 
            }

            if (btnDevlog) {
                const hasDevlog = siteData.vlogs.some(v => v.terkait_game === data.judul);
                
                if (hasDevlog) {
                    btnDevlog.style.display = "flex"; 
                    btnDevlog.onclick = () => goToDevlogFilter(data.judul); 
                } else {
                    btnDevlog.style.display = "none"; 
                }
            }

            if(platformsEl) {
                let iconsHTML = getPlatformIcons(data.platform);
                iconsHTML = iconsHTML.replace(/text-gray-500/g, 'text-gray-900').replace(/w-4 h-4/g, 'w-5 h-5');
                platformsEl.innerHTML = iconsHTML;
                platformsEl.style.opacity = 1;
            }

            titleEl.style.opacity = 1;
            descEl.style.opacity = 1;
        }, 300); 
    }

    function goToDevlogFilter(judulGame) {
        setPublicTab('vlogs');
        
        const selectPublic = document.getElementById('vlogFilterPublic');
        
        if (selectPublic) {
            selectPublic.value = judulGame;
            
            renderVlogFiltered(true);   
        }
    }

    function updateCards() {
        slides.forEach((slide, i) => {
            slide.className = 'slide-card'; 
            
            if (i === currentIndex) {
                slide.classList.add('card-front');
            } else if (i === (currentIndex + 1) % slides.length) {
                slide.classList.add('card-middle');
            } else if (i === (currentIndex + 2) % slides.length) {
                slide.classList.add('card-back');
            } else {
                slide.classList.add('card-hidden');
            }
        });
        updateContent(currentIndex);
    }

    function nextSlide() {
        if (slides.length > 1) {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCards();
        }
    }

    updateCards();

    if(slides.length > 1) {
        autoSlideInterval = setInterval(nextSlide, 4000);

        container.addEventListener('click', () => {
            clearInterval(autoSlideInterval);
            nextSlide();
            autoSlideInterval = setInterval(nextSlide, 4000);
        });
    }
}

function setPublicTab(tab) {
    const btnGames = document.getElementById('btnTabGames');
    const btnVlogs = document.getElementById('btnTabVlog');
    const viewGames = document.getElementById('view-games');
    const viewVlogs = document.getElementById('view-vlogs');
    
    const baseClass = "flex-1 sm:flex-none px-4 sm:px-8 py-2 md:py-2.5 rounded-md md:rounded-lg font-medium text-xs md:text-sm transition-all ";
    
    const activeClass = baseClass + "bg-brand-500 text-white shadow-md shadow-brand-500/20";
    const inactiveClass = baseClass + "text-gray-500 hover:text-gray-900 hover:bg-gray-50";

    if (tab === 'games') {
        viewGames.classList.remove('hidden'); viewVlogs.classList.add('hidden');
        btnGames.className = activeClass; btnVlogs.className = inactiveClass;
    } else {
        viewGames.classList.add('hidden'); viewVlogs.classList.remove('hidden');
        btnVlogs.className = activeClass; btnGames.className = inactiveClass;
    }
}

function getPlatformIcons(platformString) {
    if (!platformString) return '';
    const p = platformString.toLowerCase();
    
    let icons = `<div class="flex flex-wrap items-center gap-4 mt-2 text-gray-500">`; 
    
    if(p.includes('windows')) {
        icons += `<div class="flex items-center gap-1.5"><svg viewBox="0 0 448 512" class="w-4 h-4 flex-shrink-0" fill="currentColor"><path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z"/></svg><span class="text-[11px] font-bold uppercase tracking-wider leading-none pt-0.5">Windows</span></div>`;
    }
    if(p.includes('android')) {
        icons += `<div class="flex items-center gap-1.5"><svg viewBox="0 0 576 512" class="w-4 h-4 flex-shrink-0" fill="currentColor"><path d="M420.55,301.93a24,24,0,1,1,24-24,24,24,0,0,1-24,24m-265.1,0a24,24,0,1,1,24-24,24,24,0,0,1-24,24m273.7-144.48,47.94-83a10,10,0,1,0-17.27-10h0l-48.54,84.07a301.25,301.25,0,0,0-246.56,0L116.18,64.45a10,10,0,1,0-17.27,10h0l48,83.17C64.93,202.22,8.24,285.55,0,384H576c-8.24-98.45-64.93-181.78-146.85-226.55"/></svg><span class="text-[11px] font-bold uppercase tracking-wider leading-none pt-0.5">Android</span></div>`;
    }
    if(p.includes('ios') || p.includes('apple') || p.includes('mac')) {
        icons += `<div class="flex items-center gap-1.5"><svg viewBox="0 0 384 512" class="w-4 h-4 flex-shrink-0" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg><span class="text-[11px] font-bold uppercase tracking-wider leading-none pt-0.5">Apple</span></div>`;
    }
    if(p.includes('web')) {
        icons += `<div class="flex items-center gap-1.5"><svg viewBox="0 0 512 512" class="w-4 h-4 flex-shrink-0" fill="currentColor"><path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64h185.4c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"/></svg><span class="text-[11px] font-bold uppercase tracking-wider leading-none pt-0.5">Web</span></div>`;
    }

    icons += `</div>`;
    return icons;
}

function renderGames() {
    const container = document.getElementById('public-games-container');
    const pagContainer = document.getElementById('games-pagination');
    const games = siteData.games;
    
    if(document.getElementById('gameCountStat')) { document.getElementById('gameCountStat').innerText = games.length; }
    if (games.length === 0) { 
        container.innerHTML = `<p class="col-span-full text-center text-gray-500">Belum ada game yang dirilis.</p>`; 
        if(pagContainer) pagContainer.innerHTML = '';
        return; 
    }

    const totalPages = Math.ceil(games.length / itemsPerPage);
    if (currentPageGames > totalPages) currentPageGames = totalPages;
    const startIndex = (currentPageGames - 1) * itemsPerPage;
    const paginatedGames = games.slice(startIndex, startIndex + itemsPerPage);

    let html = '';
    paginatedGames.forEach(g => {
        let badgeColor = g.status === 'Rilis' ? 'bg-green-100 text-green-700 border-green-200' : (g.status === 'Early Access' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200');
        if(g.status === 'Tahap Konsep') badgeColor = 'bg-gray-100 text-gray-600 border-gray-200';

        html += `
        <div class="bg-white rounded-2xl overflow-hidden border border-gray-200 card-hover transition duration-300 flex flex-col group relative shadow-sm mx-4 sm:mx-0">
            <div class="h-48 sm:h-56 relative overflow-hidden bg-gray-100 shrink-0">
                <img src="${g.gambar}" alt="${g.judul}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" onerror="this.src='https://via.placeholder.com/800x400?text=Image+Error'">
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                ${g.status ? `<span class="absolute top-3 sm:top-4 right-3 sm:right-4 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${badgeColor} z-10">${g.status}</span>` : ''}
            </div>
            <div class="p-5 sm:p-6 flex-grow flex flex-col -mt-6 relative z-10 bg-white rounded-t-2xl">
                <h3 class="font-heading font-bold text-xl sm:text-2xl text-gray-900">${g.judul}</h3>
                ${getPlatformIcons(g.platform)}
                <p class="text-gray-600 text-sm flex-grow my-4 leading-relaxed">${g.deskripsi}</p>
                <div class="mt-auto">
                    ${g.link && g.link !== '#' ? `<a href="${g.link}" target="_blank" class="inline-block text-center w-full bg-gray-100 hover:bg-brand-500 text-gray-800 hover:text-white text-sm font-semibold py-2.5 rounded-lg transition">Lihat Game</a>` : `<button disabled class="w-full bg-gray-100 text-gray-400 border border-gray-200 text-sm font-medium py-2.5 rounded-lg cursor-not-allowed">Belum Ada Link</button>`}
                </div>
            </div>
        </div>`;
    });
    container.innerHTML = html;
    renderPaginationControls('games-pagination', totalPages, currentPageGames, 'games');
}

function updateGameDropdowns() {
    const selectPublic = document.getElementById('vlogFilterPublic');
    if(!selectPublic) return;
    let filterHTML = `<option value="All">Semua Game / Umum</option>`;
    
    siteData.games.forEach(g => { 
        const adaDevlog = siteData.vlogs.some(v => v.terkait_game === g.judul);
        if (adaDevlog) {
            filterHTML += `<option value="${g.judul}">${g.judul}</option>`; 
        }
    });
    
    selectPublic.innerHTML = filterHTML;
}


function parseMedia(urls) {
    if (!urls) return '';

    const mediaArray = urls.split(',').map(s => s.trim()).filter(s => s);
    let htmlOutput = '';

    const videos = mediaArray.filter(url => url.includes('youtube.com') || url.includes('youtu.be'));
    const images = mediaArray.filter(url => !url.includes('youtube.com') && !url.includes('youtu.be'));

    videos.forEach(url => {
        let videoId = '';
        if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
        else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
        
        if (videoId) {
            htmlOutput += `
            <div class="mt-6 aspect-video rounded-xl overflow-hidden shadow-md border border-gray-800 mb-4 bg-gray-900 transition duration-300 hover:border-brand-500">
                <iframe class="w-full h-full" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            </div>`;
        }
    });

    if (images.length === 1) {
        htmlOutput += `
        <div class="mt-6 rounded-xl overflow-hidden shadow-md border border-gray-800 bg-gray-900 flex items-center justify-center transition-colors duration-300 hover:border-brand-500">
            <img src="${images[0]}" class="w-full h-auto max-h-[500px] object-contain" alt="Media Devlog" onerror="this.style.display='none'">
        </div>`;
    } else if (images.length > 1) {
        htmlOutput += `<div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">`;
        images.forEach(img => {
            htmlOutput += `
            <div class="rounded-xl overflow-hidden shadow-md border border-gray-800 group bg-gray-900 aspect-video flex items-center justify-center transition-colors duration-300 hover:border-brand-500">
                <img src="${img}" class="w-full h-full object-contain group-hover:scale-105 transition duration-500" alt="Galeri Devlog" onerror="this.style.display='none'">
            </div>`;
        });
        htmlOutput += `</div>`;
    }

    return htmlOutput;
}

function renderVlogFiltered(resetPage = false) {
    const container = document.getElementById('public-vlog-container');
    const filterSelect = document.getElementById('vlogFilterPublic');
    const pagContainer = document.getElementById('vlogs-pagination');
    if(!container || !filterSelect) return;
    
    if (resetPage === true) currentPageVlogs = 1; 

    const filterValue = filterSelect.value;
    let filteredVlogs = siteData.vlogs;
    if (filterValue !== "All") filteredVlogs = siteData.vlogs.filter(v => v.terkait_game === filterValue);

    if (filteredVlogs.length === 0) { 
        container.innerHTML = `<p class="col-span-full text-center text-gray-500 py-8">Belum ada catatan developer.</p>`; 
        if(pagContainer) pagContainer.innerHTML = '';
        return; 
    }

    const totalPages = Math.ceil(filteredVlogs.length / itemsPerPage);
    if (currentPageVlogs > totalPages) currentPageVlogs = totalPages;
    const startIndex = (currentPageVlogs - 1) * itemsPerPage;
    const paginatedVlogs = filteredVlogs.slice(startIndex, startIndex + itemsPerPage);

    let html = '';
    paginatedVlogs.forEach(v => {
        let catColor = 'text-brand-600 bg-brand-50 border-brand-200';
        if(v.kategori === 'Pengumuman') catColor = 'text-yellow-700 bg-yellow-50 border-yellow-200';
        if(v.kategori === 'Bug Fixes') catColor = 'text-green-700 bg-green-50 border-green-200';
        
        let snippet = v.konten.replace(/\n/g, ' ');
        if (snippet.length > 100) snippet = snippet.substring(0, 100) + '...';
        
        const tagGame = v.terkait_game && v.terkait_game !== "Umum" ? `<span class="truncate max-w-[130px] ml-2 font-medium text-gray-500 border-l border-gray-300 pl-2" title="${v.terkait_game}">${v.terkait_game}</span>` : '';
        
        let mediaThumbnail = '';
        if(v.media_url) {
            let thumbUrl = v.media_url.split(',')[0].trim(); 
            if (thumbUrl.includes('youtube.com') || thumbUrl.includes('youtu.be')) {
                let videoId = '';
                if (thumbUrl.includes('v=')) videoId = thumbUrl.split('v=')[1].split('&')[0];
                else if (thumbUrl.includes('youtu.be/')) videoId = thumbUrl.split('youtu.be/')[1].split('?')[0];
                thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            }
            mediaThumbnail = `<div class="h-40 w-full mb-4 rounded-xl overflow-hidden bg-gray-100 shrink-0"><img src="${thumbUrl}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Thumbnail" onerror="this.style.display='none'"></div>`;
        }

        html += `
        <div onclick="openVlogModal('${v.id}')" class="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm card-hover cursor-pointer transition duration-300 group flex flex-col h-full mx-4 sm:mx-0">
            ${mediaThumbnail}
            <div class="flex flex-wrap gap-2 mb-3 text-[11px] items-center">
                <span class="px-2.5 py-1 border rounded-full ${catColor} font-bold tracking-wide uppercase">${v.kategori}</span>
                <span class="text-gray-400 font-medium">${v.tanggal}</span>
                ${tagGame}
            </div>
            <h3 class="text-xl font-heading font-bold text-gray-900 mb-2 group-hover:text-brand-500 transition line-clamp-2">${v.judul}</h3>
            <p class="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">${snippet}</p>
            <div class="mt-auto text-brand-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Baca selengkapnya <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
        </div>`;
    });
    container.innerHTML = html;
    renderPaginationControls('vlogs-pagination', totalPages, currentPageVlogs, 'vlogs');
}


function openVlogModal(id) {
    const v = siteData.vlogs.find(x => x.id === id);
    if(!v) return;

    const modal = document.getElementById('vlogModal');
    const box = document.getElementById('vlogBox');
    const content = document.getElementById('vlogModalContent');

    let catColor = 'text-brand-600 bg-brand-50 border-brand-200';
    if(v.kategori === 'Pengumuman') catColor = 'text-yellow-700 bg-yellow-50 border-yellow-200';
    if(v.kategori === 'Bug Fixes') catColor = 'text-green-700 bg-green-50 border-green-200';

    const tagGame = v.terkait_game && v.terkait_game !== "Umum" ? `<span class="ml-2 font-medium text-gray-500 border-l border-gray-300 pl-2">Game: <span class="text-gray-900">${v.terkait_game}</span></span>` : '';
    const fullContent = v.konten.replace(/\n/g, '<br>');

    content.innerHTML = `
        <div class="flex flex-wrap gap-3 mb-5 text-sm items-center">
            <span class="px-3 py-1 border rounded-full ${catColor} font-bold">${v.kategori}</span>
            <span class="text-gray-500 font-medium">${v.tanggal}</span>
            ${tagGame}
        </div>
        <h2 class="text-3xl font-heading font-extrabold text-gray-900 mb-6">${v.judul}</h2>
        <div class="text-gray-700 leading-relaxed text-base mb-8 whitespace-pre-wrap">${fullContent}</div>
        ${parseMedia(v.media_url)}
    `;

    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.remove('opacity-0'); box.classList.remove('scale-95'); }, 10);
}

function closeVlogModal() {
    const modal = document.getElementById('vlogModal');
    const box = document.getElementById('vlogBox');
    modal.classList.add('opacity-0'); box.classList.add('scale-95');
    
    setTimeout(() => { 
        modal.classList.add('hidden'); 
        document.getElementById('vlogModalContent').innerHTML = '';
    }, 300);
}

function renderPencapaian() {
    const container = document.getElementById('public-pencapaian-container');
    const pagContainer = document.getElementById('pencapaian-pagination');
    if(!container) return;
    const data = siteData.pencapaian;
    if (data.length === 0) { 
        container.innerHTML = `<p class="col-span-full text-center text-gray-500">Belum ada data pencapaian.</p>`; 
        if(pagContainer) pagContainer.innerHTML = '';
        return; 
    }

    const totalPages = Math.ceil(data.length / itemsPerPage);
    if (currentPagePencapaian > totalPages) currentPagePencapaian = totalPages;
    const startIndex = (currentPagePencapaian - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    let html = '';
    paginatedData.forEach(p => {
        html += `
        <div onclick="openPencapaianModal('${p.id}')" class="bg-white rounded-2xl overflow-hidden border border-gray-200 card-hover cursor-pointer transition duration-300 group relative shadow-sm mx-4 sm:mx-0">
            <div class="h-48 sm:h-64 md:h-72 relative overflow-hidden bg-gray-100">
                <img src="${p.gambar}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="${p.nama}">
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>
            </div>
            <div class="absolute bottom-0 left-0 w-full p-5 flex flex-col justify-end">
                <span class="text-brand-500 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-1 sm:mb-2 block">${p.tanggal}</span>
                <h3 class="font-heading font-bold text-lg sm:text-xl md:text-2xl text-white mb-2 sm:mb-3 leading-tight group-hover:text-brand-400 transition">${p.nama}</h3>
                <div class="flex items-center text-gray-300 text-xs sm:text-sm font-medium group-hover:text-brand-500 transition-colors">
                    Lihat detail 
                    <svg class="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 transform group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                </div>
            </div>
        </div>`;
    });
    container.innerHTML = html;
    renderPaginationControls('pencapaian-pagination', totalPages, currentPagePencapaian, 'pencapaian');
}

function openPencapaianModal(id) {
    const p = siteData.pencapaian.find(x => x.id === id);
    if(!p) return;

    const modal = document.getElementById('pencapaianModal');
    const box = document.getElementById('pencapaianBox');
    const content = document.getElementById('pencapaianModalContent');

    let galleryHtml = '';
    if (p.galeri) {
        const imgs = p.galeri.split(',').map(s => s.trim()).filter(s => s);
        if (imgs.length > 0) {
            galleryHtml = `<div class="mt-8"><h4 class="text-lg font-heading font-bold text-gray-900 mb-4">Galeri</h4><div class="grid grid-cols-2 gap-4">`;
            imgs.forEach(img => { galleryHtml += `<img src="${img}" class="w-full h-32 md:h-48 object-cover rounded-xl border border-gray-200 shadow-sm">`; });
            galleryHtml += `</div></div>`;
        }
    }

    content.innerHTML = `
        <img src="${p.gambar}" class="w-full h-auto object-contain rounded-xl mb-6 shadow-md bg-gray-50">
        <span class="inline-block px-3 py-1 bg-brand-50 text-brand-600 border border-brand-200 rounded-full text-sm font-bold mb-4">${p.tanggal}</span>
        <h2 class="text-3xl font-heading font-extrabold text-gray-900 mb-4">${p.nama}</h2>
        <div class="text-gray-600 leading-relaxed whitespace-pre-wrap">${p.deskripsi}</div>
        ${galleryHtml}
    `;
    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.remove('opacity-0'); box.classList.remove('scale-95'); }, 10);
}

function closePencapaianModal() {
    const modal = document.getElementById('pencapaianModal');
    const box = document.getElementById('pencapaianBox');
    modal.classList.add('opacity-0'); box.classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); }, 300);
}

function renderCrowdfunding() {
    const container = document.getElementById('crowdfunding-container');
    if (!container || !siteData.crowdfunding || siteData.crowdfunding.length === 0) return;

    const formatRp = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);

    const isSingle = siteData.crowdfunding.length === 1;
    const wrapperClass = isSingle ? "max-w-3xl mx-auto w-full" : "grid grid-cols-1 lg:grid-cols-2 gap-8";

    let html = `<div class="${wrapperClass}">`; 

    siteData.crowdfunding.forEach(data => {
        const target = parseFloat(data.targetDana) || 0;
        const terkumpul = parseFloat(data.terkumpul) || 0;
        const persenInt = target > 0 ? Math.min(Math.round((terkumpul / target) * 100), 100) : 0;
        
        html += `
        <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 relative overflow-hidden flex flex-col h-full">
            <div class="inline-block mb-4 px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-widest shadow-sm w-fit">
                Proyek Pendanaan Aktif
            </div>
            
            <h3 class="text-2xl font-heading font-extrabold text-gray-900 mb-3">${data.namaProyek}</h3>
            <p class="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed flex-grow">${data.deskripsi}</p>
            
            <div class="bg-gray-50 p-5 sm:p-6 rounded-2xl border border-gray-200 mb-6">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-0 mb-4">
                    <div>
                        <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Terkumpul</p>
                        <p class="text-2xl sm:text-3xl font-extrabold text-brand-500 leading-none">${formatRp(terkumpul)}</p>
                    </div>
                    <div class="text-left sm:text-right mt-1 sm:mt-0">
                        <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Target</p>
                        <p class="text-base sm:text-lg font-bold text-gray-900 leading-none">${formatRp(target)}</p>
                    </div>
                </div>
                
                <div class="w-full bg-gray-200 rounded-full h-3.5 mb-3 overflow-hidden">
                    <div class="bg-brand-500 h-full rounded-full" style="width: ${persenInt}% !important;"></div>
                </div>
                
                <div class="flex justify-between items-center text-xs font-bold">
                    <p class="text-gray-500">${data.donatur ? data.donatur.length : 0} Donatur</p>
                    <p class="text-brand-500">${persenInt}% Tercapai</p>
                </div>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-3 mt-auto w-full">
                <button onclick="openBenefitModal('${data.id}')" class="flex-1 px-6 py-3 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl shadow-md transition text-center w-full">Dukung Sekarang</button>
                <button onclick="openDonaturModal('${data.id}')" class="flex-1 px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-xl shadow-sm transition w-full">Lihat Donatur</button>
            </div>
        </div>`;
    });

    html += '</div>';
    container.innerHTML = html;
}

function openDonaturModal(id) {
    const project = siteData.crowdfunding.find(p => p.id === id);
    if (!project) return;

    const modal = document.getElementById('donaturModal');
    const box = document.getElementById('donaturBox');
    const content = document.getElementById('donaturModalContent');
    const formatRp = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);

    let commentsHtml = '';
    if (project.donatur && project.donatur.length > 0) {
        project.donatur.forEach(d => {
            commentsHtml += `
            <div class="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm mb-4">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-gray-900">${d.nama}</h4>
                    <span class="text-xs text-gray-500 font-medium">${d.tanggal}</span>
                </div>
                <p class="text-gray-700 italic mb-3 text-sm">"${d.pesan}"</p>
                <div class="inline-block px-3 py-1 bg-brand-50 text-brand-600 rounded-lg text-xs font-bold">
                    Mendukung ${formatRp(d.nominal)}
                </div>
            </div>`;
        });
    } else {
        commentsHtml = `<p class="text-center text-gray-500 py-6">Belum ada dukungan. Jadilah yang pertama!</p>`;
    }

    content.innerHTML = `
        <div class="mb-6 border-b border-gray-100 pb-4">
            <h2 class="text-2xl font-heading font-extrabold text-gray-900">Dukungan & Pesan</h2>
            <p class="text-gray-500 text-sm mt-1">Untuk: ${project.namaProyek}</p>
        </div>
        <div class="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            ${commentsHtml}
        </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.remove('opacity-0'); box.classList.remove('scale-95'); }, 10);
}

function closeDonaturModal() {
    const modal = document.getElementById('donaturModal');
    const box = document.getElementById('donaturBox');
    modal.classList.add('opacity-0'); box.classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); }, 300);
}

function openBenefitModal(id) {
    const project = siteData.crowdfunding.find(p => p.id === id);
    if (!project) return;

    const modal = document.getElementById('benefitModal');
    const box = document.getElementById('benefitBox');
    const content = document.getElementById('benefitModalContent');

    content.innerHTML = `
        <div class="mb-5 text-center mt-2">
            <h2 class="text-2xl font-heading font-extrabold text-gray-900 mb-2">Dukungan</h2>
            <p class="text-gray-500 text-sm">Terima kasih atas niat baik Anda mendukung <b>${project.namaProyek}</b>!</p>
        </div>
        

        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <div class="text-amber-500 mt-0.5 shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
                <p class="text-sm text-amber-800 font-medium leading-relaxed">
                    Agar benefit ini tepat sasaran, mohon tuliskan format berikut di kolom <span class="font-bold">Pesan (Message)</span> saat di Saweria: <br>
                    <span class="block mt-2 font-mono text-xs bg-white px-2 py-1.5 rounded border border-amber-200 text-center font-bold">
                        Untuk: ${project.namaProyek}
                    </span>
                </p>
            </div>
        </div>

        <div class="flex flex-col gap-3">
            <a href="${project.linkDonasi}" target="_blank" onclick="closeBenefitModal()" class="w-full px-6 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-bold rounded-xl shadow-md transition text-center flex items-center justify-center gap-2">
                Mengerti, Lanjut ke Saweria
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
        </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.remove('opacity-0'); box.classList.remove('scale-95'); }, 10);
}

function closeBenefitModal() {
    const modal = document.getElementById('benefitModal');
    const box = document.getElementById('benefitBox');
    modal.classList.add('opacity-0'); box.classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); }, 300);
}

function renderPaginationControls(containerId, totalPages, currentPage, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '<div class="flex items-center space-x-2">';
    

    const prevDisabled = currentPage === 1 
        ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed' 
        : 'bg-white text-gray-600 border-gray-200 hover:text-brand-500 hover:border-brand-500 hover:bg-brand-50 cursor-pointer shadow-sm';
    const prevClick = currentPage === 1 ? '' : `onclick="changePage('${type}', ${currentPage - 1})"`;
    html += `<button ${prevClick} class="w-10 h-10 flex items-center justify-center border rounded-lg transition ${prevDisabled}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
             </button>`;

    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage 
            ? 'bg-brand-500 text-white border-brand-500 shadow-md font-bold' 
            : 'bg-white text-gray-600 border-gray-200 hover:text-brand-500 hover:border-brand-500 hover:bg-brand-50 cursor-pointer shadow-sm font-semibold';
        html += `<button onclick="changePage('${type}', ${i})" class="w-10 h-10 flex items-center justify-center border rounded-lg transition ${activeClass}">${i}</button>`;
    }

    const nextDisabled = currentPage === totalPages 
        ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed' 
        : 'bg-white text-gray-600 border-gray-200 hover:text-brand-500 hover:border-brand-500 hover:bg-brand-50 cursor-pointer shadow-sm';
    const nextClick = currentPage === totalPages ? '' : `onclick="changePage('${type}', ${currentPage + 1})"`;
    html += `<button ${nextClick} class="w-10 h-10 flex items-center justify-center border rounded-lg transition ${nextDisabled}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
             </button>`;

    html += '</div>';
    container.innerHTML = html;
}


function changePage(type, page) {
    if (type === 'games') {
        currentPageGames = page;
        renderGames();
    } else if (type === 'vlogs') {
        currentPageVlogs = page;
        renderVlogFiltered();
    } else if (type === 'pencapaian') {
        currentPagePencapaian = page;
        renderPencapaian();
    }
}