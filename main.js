const container = document.querySelector(".container");

const movie = document.getElementById("movie");

const infoText = document.querySelector(".infoText");

const seats = document.querySelectorAll(".seat:not(.reserved)");
//console.log(seats)

//Tarayıcı Veritabanından Verileri Okuma Fonksiyonu (sayfayı yenilediğimiz zaman seçilen bilgiler gitmesin diye)

const getSeatsDataFromDatabase = () => {
  // Seçilen filmin index verisini getiriyoruz

  const dbSelectedMovie = JSON.parse(localStorage.getItem("movieIndex"));
  //console.log(dbSelectedMovie)

  if (dbSelectedMovie) {
    movie.selectedIndex = dbSelectedMovie;
  }

  // seçili koltukların bilgisi alıcam. Hangi koltuklar seçiliyse onu seçili koltugun rengi sarıya boyatıcam
  const dbSelectSeats = JSON.parse(localStorage.getItem("selectedIndex"));
  //console.log(dbSelectSeats)

  if (dbSelectSeats !== null && dbSelectSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (dbSelectSeats.indexOf(index) > -1) {
        seat.classList.add("selected");
      }
    });
  }
};

// Veritabanı Kayıt Fonksiyonu

const saveToDatabase = (seatIndexData) => {
  localStorage.setItem("selectedIndex", JSON.stringify(seatIndexData));

  localStorage.setItem("movieIndex", JSON.stringify(movie.selectedIndex));
};

// calculateTotal den önce veritabanından okudugu fonksiyonu yazarak sayfa yenilensede veritabanında kayıtlı tuttugu bilgileri getirir yani sayfa yenilensede seçilen bilgileri korur sıfırlamaz
getSeatsDataFromDatabase();

// Toplam Film Ücretini Hesaplayan Fonksiyon ve Koltukların Indeks Tespit Fonksiyonu

const calculateTotal = () => {
  // ********** Veritabanı İşlemleri için koltukların indeks bilgisinin tespiti **********
  //1-Seçilen koltukların bilgisi
  //2-Tüm koltukların indeksi (tüm koltuklar için yukarıda document.querySelecterAll ile çağırdık)

  //Seçilen koltukların bilgisi
  const selectedSeats = container.querySelectorAll(".seat.selected");

  //Tüm seçilen koltukları NodeListten normal diziye döndürecek
  const allSeatsArray = [];

  //Seçilen koltukları Nodelistten normal diziye döndürecek
  const allSelectedSeatsArray = [];

  //Tüm koltukları gezer ve bunları allSeatsArray dizisine push metodu ile atar dizide de her koltugun indeksi olmuş olur
  seats.forEach((seat) => {
    allSeatsArray.push(seat);
  });

  //Seçilen(sarı) koltukları gezer ve bunları allSelectedSeatsArray dizisine push metodu ile atar dizide de her koltugun indeksi olmuş olur
  selectedSeats.forEach((selectedSeat) => {
    allSelectedSeatsArray.push(selectedSeat);
  });

  let selectedIndexs = allSelectedSeatsArray.map((allSelectedSeat) => {
    return allSeatsArray.indexOf(allSelectedSeat);
  });

  // Toplam film ücretini Hesaplama İşlemleri

  // seçilen koltukların sayısı
  let selectedSeatsCount = container.querySelectorAll(".seat.selected").length;

  if (selectedSeatsCount > 0) {
    infoText.style.display = "block";
  } else {
    infoText.style.display = "none";
  }
  // film ücreti
  let price = movie.value;

  // toplam film ücreti
  let total = price * selectedSeatsCount;

  infoText.innerHTML = `
   <span> ${selectedSeatsCount} </span>koltuk için hesaplanan ücret<span> ${total} </span>TL
   `;

  saveToDatabase(selectedIndexs);
};

calculateTotal();

// seçilen koltugu sarı renk yapar
container.addEventListener("click", (mouseEvent) => {
  //console.log(mouseEvent.target.offsetParent);

  if (
    mouseEvent.target.offsetParent.classList.contains("seat") &&
    !mouseEvent.target.offsetParent.classList.contains("reserved")
  ) {
    mouseEvent.target.offsetParent.classList.toggle("selected");
  }

  calculateTotal();
});

movie.addEventListener("change", () => {
  calculateTotal();
});
