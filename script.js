const apiKey = "ba709a337357196fdb57d7a242974e0c";

// Sayfa yüklendiğinde butonun ve Enter tuşunun çalışması için event listener ekliyoruz
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById("searchBtn");
    const cityInput = document.getElementById("cityInput");

    if(searchBtn) searchBtn.addEventListener('click', getWeather);

    // Enter tuşuna basıldığında aramayı başlatır
    if(cityInput) {
        cityInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                getWeather();
            }
        });
    }
});

async function getWeather() {
    const cityInput = document.getElementById("cityInput");
    const city = cityInput.value.trim();
    const welcomeMsg = document.getElementById("welcomeMsg");
    const weatherDisplay = document.getElementById("weatherDisplay");
    
    if (!city) return;

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=tr`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== "200") {
            alert("Şehir bulunamadı!");
            return;
        }

        // Giriş mesajını gizle ve paneli aç
        if(welcomeMsg) welcomeMsg.style.display = "none";
        if(weatherDisplay) weatherDisplay.style.display = "block";

        // 1. Ana Bilgileri ve İkonu Güncelle
        const iconCode = data.list[0].weather[0].icon; // API'den gelen ikon kodu
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Büyük ikon URL'si
        const iconElement = document.getElementById("weatherIcon");

        if(iconElement) {
            iconElement.src = iconUrl;
            iconElement.style.display = "inline-block"; // İkonu görünür yapar
        }

        document.getElementById("city").innerText = data.city.name;
        document.getElementById("temp").innerText = Math.round(data.list[0].main.temp) + "°C";
        document.getElementById("description").innerText = data.list[0].weather[0].description.toUpperCase();
        document.getElementById("humidity").innerText = data.list[0].main.humidity + "%";
        document.getElementById("wind").innerText = data.list[0].wind.speed + " km/h";

        // 2. 5 Günlük Tahmin Listesi ve Küçük İkonlar
        const forecastBox = document.getElementById("forecastBox");
        forecastBox.innerHTML = "";
        
        // Her günün öğle saatine (12:00) ait veriyi filtrele
        const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

        dailyData.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dayName = date.toLocaleDateString('tr-TR', { weekday: 'short' });
            const subIcon = item.weather[0].icon; // Her günün kendi ikonu

            forecastBox.innerHTML += `
                <div class="forecast-item">
                    <p class="day">${dayName}</p>
                    <img src="https://openweathermap.org/img/wn/${subIcon}.png" alt="icon" style="width: 40px;">
                    <p class="temp">${Math.round(item.main.temp)}°C</p>
                    <p style="font-size:10px; opacity:0.8;">${item.weather[0].description}</p>
                </div>
            `;
        });

    } catch (err) { 
        console.error("Hava durumu çekilirken bir hata oluştu:", err); 
    }
}