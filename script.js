const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
let currentDate = new Date();  // Fecha actual que se mantendrá para la navegación
let cycleStart = null;  // Fecha de inicio del ciclo menstrual
let cycleLength = 28;  // Duración predeterminada del ciclo

// Renderiza el calendario según el mes y año actual
function renderCalendar() {
    const calendarElement = document.getElementById("calendar");
    calendarElement.innerHTML = "";

    // Título del mes
    document.querySelector(".calendar-container h2").textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    // Mostrar días de la semana
    daysOfWeek.forEach(day => {
        const dayElement = document.createElement("div");
        dayElement.classList.add("day");
        dayElement.textContent = day;
        calendarElement.appendChild(dayElement);
    });

    const totalDaysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    // Mostrar los días del mes
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement("div");
        calendarElement.appendChild(emptyDay);
    }

    for (let day = 1; day <= totalDaysInMonth; day++) {
        const dayElement = document.createElement("div");
        dayElement.classList.add("day");
        dayElement.textContent = day;

        // Marcar días del ciclo menstrual si hay datos registrados
        if (cycleStart) {
            const startCycleDay = new Date(cycleStart);
            startCycleDay.setFullYear(currentDate.getFullYear());
            startCycleDay.setMonth(currentDate.getMonth());
            const cycleEnd = new Date(startCycleDay);
            cycleEnd.setDate(cycleEnd.getDate() + cycleLength);

            // Asegurarse de marcar solo los días dentro del mes actual
            if ((startCycleDay.getMonth() === currentDate.getMonth() && day >= startCycleDay.getDate()) ||
                (cycleEnd.getMonth() === currentDate.getMonth() && day <= cycleEnd.getDate())) {
                dayElement.classList.add("period");
            }
        }

        // Marcar días fértiles (días 14-16 después del inicio)
        if (cycleStart) {
            const fertileStart = new Date(cycleStart);
            fertileStart.setFullYear(currentDate.getFullYear());
            fertileStart.setMonth(currentDate.getMonth());
            fertileStart.setDate(fertileStart.getDate() + 14);

            const fertileEnd = new Date(fertileStart);
            fertileEnd.setDate(fertileEnd.getDate() + 2);

            if (day >= fertileStart.getDate() && day <= fertileEnd.getDate()) {
                dayElement.classList.add("fertile");
            }
        }

        calendarElement.appendChild(dayElement);
    }
}

// Función para ir al mes anterior
function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

// Función para ir al mes siguiente
function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

// Función para registrar el ciclo
function registerCycle() {
    const startInput = document.getElementById("cycle-start").value;
    const lengthInput = document.getElementById("cycle-length").value;

    if (startInput && lengthInput && !isNaN(Date.parse(startInput)) && !isNaN(lengthInput) && lengthInput > 0) {
        cycleStart = new Date(startInput);
        cycleLength = parseInt(lengthInput, 10);

        // Solo actualiza el calendario para el mes del ciclo registrado
        renderCalendar();
    } else {
        alert("Por favor, ingresa una fecha válida y una duración de ciclo correcta.");
    }
}

// Llamar a renderCalendar inicialmente para mostrar el calendario del mes actual
renderCalendar();
