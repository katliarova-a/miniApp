let score = 0;
let scoreInHour = 0;
let countClick = 10;
let fullEnergy = 500;
let energy = 500;
let percentEnerge;
let percentTicket;
let ticket = 1;
let nextTicketThreshold = 50; // Следующий порог для билета

let scoreHTML = document.getElementById("coffeScore");
let scoreInHourHTML = document.getElementById("inHour");
let energyHTML = document.getElementById("energyText");
let energyFillHTML = document.getElementById("energyFill");
let ticketHTML = document.getElementById("ticketText");
let ticketFillTHML = document.getElementById("ticketFill");


document.getElementById("objectClick").addEventListener('touchstart', clicker);

function clicker(event){
    if(energy >= countClick){
        score += event.touches.length*countClick;
        scoreHTML.innerText = score;

        energy -= event.touches.length*countClick;
        energyHTML.innerHTML = energy;

        percentEnerge = (energy / fullEnergy) * 100;
        energyFill.style.width = percentEnerge + "%";

        checkTickets(); // Проверяем, нужно ли начислить билет
    }
    
}

// Функция пополнения энергии
function regenerateEnergy() {
    if (energy < fullEnergy) {
        energy += 1;
        energyHTML.innerHTML = energy;

        percentEnerge = (energy / fullEnergy) * 100;
        energyFillHTML.style.width = percentEnerge + "%";
    }
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