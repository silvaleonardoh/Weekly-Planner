document.addEventListener('DOMContentLoaded', function () {
    const calendarBody = document.getElementById('calendar-body');
    const modal = document.getElementById('modal');
    const closeModalButton = document.getElementById('close-modal');
    const adicionarEventoButton = document.getElementById('adicionar-evento');
    const nomeEventoInput = document.getElementById('nome-evento');
    const categoriaEventoInput = document.getElementById('categoria-evento');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const monthYearDisplay = document.getElementById('current-month');

    let selectedDayElement = null;
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    closeModalButton.addEventListener('click', closeModal);
    adicionarEventoButton.addEventListener('click', addEvent);

    function updateMonthDisplay() {
        const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        monthYearDisplay.textContent = monthNames[currentMonth] + " " + currentYear;
    }

    // Função para avançar para o próximo mês
    function nextMonth() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateMonthDisplay();
        generateCalendar();
    }

    // Função para retroceder para o mês anterior
    function prevMonth() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateMonthDisplay();
        generateCalendar();
    }

    // Event listeners para os botões "Mês Anterior" e "Próximo Mês"
    prevMonthButton.addEventListener('click', prevMonth);
    nextMonthButton.addEventListener('click', nextMonth);

    // Função para gerar uma cor aleatória
    function generateRandomColor() {
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);
        return `rgb(${red}, ${green}, ${blue})`;
    }

    function generateCalendar() {
        if (calendarBody ?.innerHTML != null) {
            calendarBody.innerHTML = ''; // Limpa o conteúdo atual do calendário
            const firstDay = new Date(currentYear, currentMonth, 1);
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const emptyDays = firstDay.getDay();

            for (let i = 0; i < emptyDays; i++) {
                calendarBody.appendChild(document.createElement('div'));
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.innerHTML = `<div class="day-number">${day}</div>`;
                // dayElement.style.backgroundColor = generateRandomColor(); // Aplica uma cor aleatória
                dayElement.addEventListener('click', () => openModal(dayElement));
                calendarBody.appendChild(dayElement);
            }
        }
    }

    function openModal(dayElement) {
        selectedDayElement = dayElement;
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    function addEvent() {
        const eventName = nomeEventoInput.value.trim();
        const eventCategory = categoriaEventoInput.value.trim().toLowerCase();

        if (!eventName | !eventCategory) {
            alert('Por favor, preencha todos os campos do evento.');
            return;
        }

        const eventElement = document.createElement('div');
        eventElement.classList.add('event', eventCategory);
        eventElement.textContent = eventName;

        // Adicionar um botão de exclusão ('X') ao evento
        const deleteButton = document.createElement('span');
        deleteButton.textContent = 'X';
        deleteButton.classList.add('delete-event');
        deleteButton.onclick = function (e) {
            e.stopPropagation();
            if (confirm('Deseja deletar este evento?')) {
                eventElement.remove();
            }
        };

        eventElement.appendChild(deleteButton);
        selectedDayElement.appendChild(eventElement);

        nomeEventoInput.value = '';
        categoriaEventoInput.value = '';
        closeModal();
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        }
    };

    updateMonthDisplay();
    generateCalendar();
});