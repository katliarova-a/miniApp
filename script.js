//localStorage.clear();

let score = localStorage.getItem("score") ? Number(localStorage.getItem("score")) : 0;
let countClick = 10;
let fullEnergy = localStorage.getItem("fullEnergy") ? Number(localStorage.getItem("fullEnergy")) : 500;
let energy = localStorage.getItem("energy") ? Number(localStorage.getItem("energy")) : 500;
let percentEnerge;
let percentTicket;
let ticket = 1;
let nextTicketThreshold = 50; // Следующий порог для билета
let lvlEnergy = localStorage.getItem("lvlEnergy") ? Number(localStorage.getItem("lvlEnergy")) : 0;
let priceLvlEnergy = localStorage.getItem("priceLvlEnergy") ? Number(localStorage.getItem("priceLvlEnergy")) : 100;
let countLvlEnergy = localStorage.getItem("countLvlEnergy") ? Number(localStorage.getItem("countLvlEnergy")) : 100;
let scoreInHour = localStorage.getItem("scoreInHour") ? Number(localStorage.getItem("scoreInHour")) : 0;

let cardData = {
  1: {img:"cardPassive1.jpg", title: "Корица Буст", level: 0, bonus: 100, price: 100 },
  2: {img:"cardPassive2.jpg", title: "Сеньор Капучино", level: 0, bonus: 250, price: 200 },
  3: {img:"cardPassive3.jpg", title: "Пабло Эспрессо", level: 0, bonus: 300, price: 350 },
  4: {img:"cardPassive4.jpg", title: "Айс Кофиано", level: 0, bonus: 400, price: 500 },
  5: {img:"cardPassive5.jpg", title: "Аль Карамель", level: 0, bonus: 500, price: 800 }
};

// При загрузке страницы — восстановить уровни из localStorage
Object.keys(cardData).forEach(id => {
  const saved = JSON.parse(localStorage.getItem(`card_${id}`));
  if (saved) {
    cardData[id] = saved;
  }
});

//ПРОВЕРКА НА ДАТУ СБРОСА ВОССТАНОВЛЕНИЯ ЭНЕРГИИ
let savedDate = localStorage.getItem("countRestartDate");
let today = new Date().toDateString();
let countRestart;

if (savedDate !== today) {
    countRestart = 0; // сброс
    localStorage.setItem("countRestart", countRestart);
    localStorage.setItem("countRestartDate", today);
} else {
    countRestart = Number(localStorage.getItem("countRestart")) || 0;
}

let scoreHTML = document.getElementById("coffeScore");
let scoreInHourHTML = document.getElementById("inHour");
let energyHTML = document.getElementById("energyText");
let energyFillHTML = document.getElementById("energyFill");
let ticketHTML = document.getElementById("ticketText");
let ticketFillTHML = document.getElementById("ticketFill");

let lvlEnergyHTML = document.querySelectorAll(".lvlEnergy");
let priceLvlEnergyHTML = document.querySelector("#priceLvlEnergy");
let countLvlEnergyHTML = document.querySelector("#countLvlEnergy");

let countRestartHTML = document.querySelectorAll(".countRestart");

const obj = document.getElementById("objectClick");
if (obj) {
  obj.addEventListener('touchstart', clicker);
}

function boxFillFunction(){
    percentEnerge = (energy / fullEnergy) * 100;
    energyFill.style.width = percentEnerge + "%";
}

function startPageGame(){
    scoreHTML.innerHTML = Math.floor(score);
    energyHTML.innerText = energy;
    boxFillFunction();
    scoreInHourHTML.innerText = scoreInHour;
}

function startPageEarnings(){
    startPageGame()
    priceLvlEnergyHTML.innerText = priceLvlEnergy;
    lvlEnergyHTML.forEach(el => {
        el.innerText = lvlEnergy;
    });
    countLvlEnergyHTML.innerText = countLvlEnergy;

    countRestartHTML.forEach(el => {
        el.innerText = countRestart;
    });

}

//ПРОВЕРКА СТАРТОВОЙ СТРАНИЦЫ
const path = window.location.pathname;
if (path.includes("index.html")) {
    startPageGame();
} else if (path.includes("income.html")) {
    startPageEarnings();
}

//ФУНКЦИЯ СОХРАНЕНИЯ ДАННЫХ
function saveData(){
    localStorage.setItem("score", score);
    localStorage.setItem("energy", energy);
    localStorage.setItem("fullEnergy", fullEnergy);
    localStorage.setItem("scoreInHour", scoreInHour);

    localStorage.setItem("lvlEnergy", lvlEnergy);
    localStorage.setItem("priceLvlEnergy", priceLvlEnergy);
    localStorage.setItem("countLvlvEnergy", countLvlEnergy);

    localStorage.setItem("countRestart", countRestart);
    localStorage.setItem("countRestartDate", new Date().toDateString());
}

function clicker(event){
    if(energy >= countClick){
        score += event.touches.length*countClick;
        scoreHTML.innerText = Math.floor(score);

        energy -= event.touches.length*countClick;
        energyHTML.innerHTML = energy;

        checkTickets(); // Проверяем, нужно ли начислить билет
        saveData();
        boxFillFunction();
    }
}

// Функция пополнения энергии
function regenerateEnergy() {
    if (energy < fullEnergy) {
        energy += 1;
        energyHTML.innerHTML = energy;
        boxFillFunction();
    }
    score+=scoreInHour/3600;
    scoreHTML.innerText = Math.floor(score);
    saveData();
}

// Функция начисления билетов
function checkTickets() {
    if (score >= nextTicketThreshold) {
        ticket ++;
        nextTicketThreshold += 50;
        ticketHTML.innerText = ticket; // Обновляем отображение билетов
        percentTicket = (ticket / 20) * 100;
        ticketFillTHML.style.width = percentTicket + "%";
    }
}

// Запускаем восстановление энергии каждую секунду
setInterval(regenerateEnergy, 1000);

const obj2 = document.getElementById("clickLvlEnergy");
if(obj2){
    obj2.addEventListener("touchstart", function(){
        if(score<priceLvlEnergy){
            document.getElementById("payLvlEnergy").style.background = "grey";
        }
        document.getElementById("screenLvlEnergy").showModal();
    });
}
const obj3 = document.getElementById("payLvlEnergy");
if(obj3){
    obj3.addEventListener("touchstart", payLvlEnergy);
}

function payLvlEnergy(){
    if(score >= priceLvlEnergy){
        score -=priceLvlEnergy;
        fullEnergy += 100;
        priceLvlEnergy = Math.round(priceLvlEnergy * 3.25);
        lvlEnergy ++;
        saveData();
        startPageEarnings();
    }
}

const obj4 = document.getElementById("payCountRestart");
if(obj4){
    obj4.addEventListener("touchstart", payCountRestart);
}
const obj5 = document.getElementById("clickCountRestart");
if(obj5){
    obj5.addEventListener("touchstart", function(){
        if(countRestart == 6){
            document.getElementById("payCountRestart").style.background = "grey";
        }
        document.getElementById("screenCountRestart").showModal();
    });
}

function payCountRestart(){
    if(countRestart < 6){
        countRestart ++;
        energy = fullEnergy;
        saveData();
        startPageEarnings();
    }
}

const containers = document.querySelectorAll('.cardPassive');

containers.forEach(container => {
  const id = container.getAttribute('data-id');
  const data = cardData[id];

  if (data) {
    container.innerHTML = `
      <div class="imageCardUpgrade" style="background-image: url('image/${data.img}'); background-size: cover;">
        <div class="lvlCardUpgrade">
          <p> ур. <span id="lvl${id}" class="lvlPassiveIncome">${data.level}</span></p>
        </div>
      </div>
      <p class="textCardUpgrade">${data.title}</p>
    `;
  }
});


const dialog = document.getElementById("screenLvlPassive");

document.querySelectorAll(".cardPassive").forEach(card => {
  let touchStartX = 0;
  let touchEndX = 0;

  card.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

  card.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;

  if (Math.abs(touchStartX - touchEndX) < 10) {
    const id = card.dataset.id;
    const data = cardData[id];

    if (data) {
      dialog.innerHTML = `
        <form method="dialog">
          <button class="closeButton" aria-label="Закрыть окно">✖</button>
          <img src="image/${data.img}" class="pic">
          <h2>${data.title}</h2>
          <div class="textContainer">
            <p>ур. <span class="lvlPassiveIncome">${data.level}</span></p>
            <img src="image/coffe.png">
            <p>+ <span class="PassiveIncome">${data.bonus}</span> в час</p>
          </div>
          <button class="payPassiveIncome pay">
            <p>Купить за <span class="priceLvlPassiveIncome">${data.price}</span></p>
          </button>
        </form>
      `;
      if(score < data.price) dialog.querySelector(".payPassiveIncome").style.background = "grey"; 
      dialog.showModal();
      dialog.querySelector(".payPassiveIncome").addEventListener("touchstart",(e) => {
        payPassiveIncome(id, data);
    });
    }
  }
});
});


function payPassiveIncome(id, data){
    if(score >= data.price){
        score -= data.price;
        // Повысим уровень
        data.level += 1;
        scoreInHour+= data.bonus;

        // Пересчитаем бонус и цену (можешь задать свою формулу)
        data.bonus = Math.floor(data.bonus * 1.5); 
        data.price = Math.floor(data.price * 2.8);

        // Сохраняем обновлённые данные
        localStorage.setItem(`card_${id}`, JSON.stringify(data));

        // Также обновим карточку на основной странице
        document.querySelector(`#lvl${id}`).textContent = data.level;
        scoreHTML.innerText = Math.floor(score);
        scoreInHourHTML.innerText = scoreInHour;
    }
}

// Вызывается при закрытии/покидании страницы
window.addEventListener('beforeunload', () => {
    localStorage.setItem('lastVisit', Date.now());
});

// При загрузке страницы
window.addEventListener('load', () => {
    const lastVisit = localStorage.getItem('lastVisit');
    const now = Date.now();
    if (lastVisit && now - lastVisit > 60 * 1000) { // больше 60 сек
        const hoursAway = (now - parseInt(lastVisit)) / (1000 * 60 * 60); // переводим миллисекунды в часы
        const offlineEarnings = Math.floor(hoursAway * scoreInHour);

        // Добавить заработок к балансу
        score += offlineEarnings;
        scoreHTML.innerText = score;

        alert(`Вы были в оффлайне ${hoursAway.toFixed(2)} ч. Заработано: ${offlineEarnings} монет`);
    }
});
