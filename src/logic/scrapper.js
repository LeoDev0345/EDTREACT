import axios from 'axios';

function getWorkingDays(dateInput) {
    // Array to hold the working days
    let workingDays = [];
    let currentDate;
    let currentDayOfWeek;
    let currentHour;

    // Function to add days to the current date
    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    if (dateInput === null || dateInput === undefined) {
        currentDate = new Date();
        currentDayOfWeek = currentDate.getDay();
        currentHour = currentDate.getHours();
    }
    else {
        dateInput = new Date(dateInput);
        currentDate = dateInput;
        currentDayOfWeek = currentDate.getDay();
        currentHour = 12
    }

    // Calculate working days based on current day of the week
    switch (currentDayOfWeek) {
        case 0: // Sunday
            currentDate.setDate(currentDate.getDate() + 1); // Move to Lundi
            for (let i = 0; i <= 4; i++) {
                workingDays.push(addDays(currentDate, i));
            }
            break;
        case 6: // Saturday
            currentDate.setDate(currentDate.getDate() + 2); // Move to Lundi
            for (let i = 0; i <= 4; i++) {
                workingDays.push(addDays(currentDate, i));
            }
            break;
        case 1: // Lundi
            for (let i = 0; i <= 4; i++) {
                workingDays.push(addDays(currentDate, i));
            }
            break;
        case 2: // Mardi
            for (let i = -1; i <= 3; i++) {
                workingDays.push(addDays(currentDate, i));
            }
            break;
        case 3: // Mercredi
            for (let i = -2; i <= 2; i++) {
                workingDays.push(addDays(currentDate, i));
            }
            break;
        case 4: // Jeudi
            for (let i = -3; i <= 1; i++) {
                workingDays.push(addDays(currentDate, i));
            }
            break;
        case 5: // Vendredi
            if (currentHour >= 20) {
                currentDate.setDate(currentDate.getDate() + 3); // Move to Lundi of next week
                for (let i = 0; i <= 4; i++) {
                    workingDays.push(addDays(currentDate, i));
                }
            }
            for (let i = -4; i <= 0; i++) {
                workingDays.push(addDays(currentDate, i));
            }
            break;
    }

    // Format dates to MM/DD/YYYY
    workingDays = workingDays.map(date => date.toLocaleDateString('en-US'));
    return workingDays;
}

async function fetchAndParseOneWorkingDay(tel, date) {
    const url = 'https://corsproxy.io/?' + `https://edtmobiliteng.wigorservices.net//WebPsDyn.aspx?Action=posETUD&serverid=C&tel=${tel}&date=${date}%208:00`;
    try {
        /*axios.defaults.headers.get['Content-Type'] = 'text/html; charset=utf-8';
        axios.defaults.headers.get['Origin'] = 'https://elouanb7.github.io';
        axios.defaults.headers.get['Access-Control-Allow-Methods'] = 'PUT, GET, HEAD, POST, DELETE, OPTIONS';*/
        // axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
        // axios.defaults.headers.get['Remote Address'] = '185.199.110.153'
        const response = await axios.get(url);
        const html = await response.data
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const lignes = doc.querySelectorAll('.Ligne');
        const daySchedule = [];
        lignes.forEach(ligne => {
            // Extract data from each 'Ligne' element
            const debut = ligne.querySelector('.Debut').textContent.trim();
            const fin = ligne.querySelector('.Fin').textContent.trim();
            const matiere = ligne.querySelector('.Matiere').textContent.trim().toUpperCase();
            const salle = ligne.querySelector('.Salle').textContent.trim();
            const prof = ligne.querySelector('.Prof').textContent.trim();

            // Push the extracted data into the 'schedule' array
            daySchedule.push({
                debut,
                fin,
                matiere,
                salle,
                prof
            });
        });
        return daySchedule;
    } catch (error) {
        console.error('Error fetching or parsing schedule for :', error);
        return null;
    }
}

function addDays(weekSchedule, workingDays) {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
    const scheduleByDay = [];
    weekSchedule.forEach((day, index) => {
        const dayOfWeek = days[index];
        const dayObject = {
            day: dayOfWeek,
            courses: day,
            date: workingDays[index]
        };
        scheduleByDay.push(dayObject);
    });
    return scheduleByDay
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to shuffle predefined colors
function shuffleColors() {
    const colors = [
        { color: "#FFB6C1", textColor: "black" },   // LightPink
        { color: "#FFA07A", textColor: "black" },   // LightSalmon
        { color: "#FA8072", textColor: "white" },   // Salmon
        { color: "#FFAEB9", textColor: "black" },   // LightSalmon
        { color: "#FFD700", textColor: "black" },   // Gold
        { color: "#FFE4B5", textColor: "black" },   // Moccasin
        { color: "#B0C4DE", textColor: "black" },   // LightSteelBlue
        { color: "#87CEEB", textColor: "black" },   // SkyBlue
        { color: "#ADD8E6", textColor: "black" },   // LightBlue
        { color: "#87CEFA", textColor: "black" },   // LightSkyBlue
        { color: "#00BFFF", textColor: "white" },   // DeepSkyBlue
        { color: "#F0FFFF", textColor: "black" },   // Azure
        { color: "#AFEEEE", textColor: "black" },   // PaleTurquoise
        { color: "#98FB98", textColor: "black" },   // PaleGreen
        { color: "#00FF7F", textColor: "black" }    // SpringGreen
    ];
    return shuffle([...colors]); // Shuffle a copy of the colors array
}

function addColorsToSchedule(weekSchedule) {
    const matiereColors = {}; // Object to store colors for each matiere
    const colors = shuffleColors(); // Shuffle predefined colors

    weekSchedule.forEach(day => {
        day.courses.forEach(course => {
            if (!matiereColors.hasOwnProperty(course.matiere)) {
                // Assign a new color if matiere is encountered for the first time
                matiereColors[course.matiere] = colors.pop(); // Pop a color from the shuffled list
            }
            course.color = matiereColors[course.matiere];
        });
    });

    return weekSchedule;
}

function isStringDotString(variable) {
    // Regular expression to match the format "string.string"
    const regex = /^[a-zA-Z]+[.][a-zA-Z]+$/;
    return regex.test(variable);
}

export default async function fetchAndParseSchedule(tel, date) {
    if (!isStringDotString(tel)) {
        return null
    }
    const workingDays = getWorkingDays(date);
    let weekSchedule = []
    for (let i = 0; i < workingDays.length; i++) {
        await fetchAndParseOneWorkingDay(tel, workingDays[i]).then(workingDay => {
            weekSchedule.push(workingDay);
        })
    }
    weekSchedule = addDays(weekSchedule, workingDays);
    return addColorsToSchedule(weekSchedule);
}

