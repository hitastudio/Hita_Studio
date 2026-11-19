tailwind.config = {
    darkMode: 'class', // <--- Tambahkan baris ini
    theme: {
        extend: {
            fontFamily: { 
                sans: ['Inter', 'sans-serif'], 
                heading: ['Outfit', 'sans-serif'] 
            },
            colors: { 
                brand: { 500: '#16a34a', 600: '#16a34a' } 
            }
        }
    }
}