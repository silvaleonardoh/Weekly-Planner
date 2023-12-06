document.addEventListener("DOMContentLoaded", function () {
  const calendarBody = document.getElementById("calendar-body");
  const modal = document.getElementById("modal");
  const closeModalButton = document.getElementById("close-modal");
  const adicionarEventoButton = document.getElementById("adicionar-evento");
  const nomeEventoInput = document.getElementById("nome-evento");
  const categoriaEventoInput = document.getElementById("categoria-evento");
  const informacoesEventoInput = document.getElementById("informacoes-evento");
  const prevMonthButton = document.getElementById("prev-month");
  const nextMonthButton = document.getElementById("next-month");
  const monthYearDisplay = document.getElementById("current-month");

  let selectedDayElement = null;
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  closeModalButton.addEventListener("click", closeModal);
  adicionarEventoButton.addEventListener("click", addEvent);

  prevMonthButton.addEventListener("click", prevMonth);
  nextMonthButton.addEventListener("click", nextMonth);

  function openModal(dayElement) {
    selectedDayElement = dayElement;
    selectedDayElement.selectedDate = new Date(
      currentYear,
      currentMonth,
      dayElement.querySelector(".day-number").textContent
    );
    modal.style.display = "block";
  }

  async function generateCalendar() {
    if (calendarBody?.innerHTML != null) {
      calendarBody.innerHTML = ""; // Limpa o conteúdo atual do calendário
      const firstDay = new Date(currentYear, currentMonth, 1);
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const emptyDays = firstDay.getDay();

      for (let i = 0; i < emptyDays; i++) {
        calendarBody.appendChild(document.createElement("div"));
      }

      const eventos = await buscarEventos();
      const eventosArray = Object.values(eventos);

      for (let day = 1; day <= daysInMonth; day++) {
        const diaElemento = document.createElement("div");
        diaElemento.className = "calendar-day";
        diaElemento.innerHTML = `<div class="day-number">${day}</div>`;
        diaElemento.addEventListener("click", () => openModal(diaElemento));

        // Filtrar eventos para este dia específico
        const diasEventos = eventosArray.filter((evento) => {
          const eventoData = new Date(evento.data);
          return (
            eventoData.getDate() === day &&
            eventoData.getMonth() === currentMonth &&
            eventoData.getFullYear() === currentYear
          );
        });

        // Adicionar eventos ao dia
        diasEventos.forEach((evento) => {
          const eventoElemento = document.createElement("div");
          eventoElemento.classList.add("evento");
          eventoElemento.textContent = evento.nome;

          // Aplicar cor com base na categoria
          switch (evento.categoria) {
            case "Trabalho":
              eventoElemento.style.backgroundColor = "blue";
              eventoElemento.style.color = "white";
              break;
            case "Pessoal":
              eventoElemento.style.backgroundColor = "yellow";
              break;
            case "Escolar":
              eventoElemento.style.backgroundColor = "green";
              eventoElemento.style.color = "white";
              break;
            case "Outro":
              eventoElemento.style.backgroundColor = "black";
              eventoElemento.style.color = "white";
              break;
            default:
              eventoElemento.style.backgroundColor = "grey";
          }

          // Criar botão de exclusão ('X')
          const deleteButton = document.createElement("span");
          deleteButton.textContent = "X";
          deleteButton.classList.add("delete-event");
          deleteButton.onclick = async function (e) {
            e.stopPropagation();
            const eventId = evento.id; // Substitua por como o ID do evento é obtido
            if (confirm("Deseja deletar este evento?")) {
              await deletarEvento(eventId);
              eventoElemento.remove();
            }
          };

          eventoElemento.appendChild(deleteButton);
          diaElemento.appendChild(eventoElemento);
        });

        calendarBody.appendChild(diaElemento);
      }
    }
  }

  async function buscarEventos() {
    try {
      const response = await fetch("http://localhost:3003/eventos");
      if (!response.ok) {
        throw new Error("Erro ao buscar eventos");
      }

      return response.json();
    } catch (error) {
      console.error("Erro na busca de eventos:", error);
    }
  }

  async function addEvent() {
    const eventName = nomeEventoInput.value.trim();
    // Obtendo o valor selecionado no combo box
    const eventCategory = categoriaEventoInput.value;
    const eventInfo = informacoesEventoInput.value.trim();

    if (!eventName || !eventCategory) {
      alert("Por favor, preencha todos os campos do evento.");
      return;
    }

    const eventElement = document.createElement("div");
    eventElement.classList.add("event");
    eventElement.textContent = eventName;

    // Definindo a cor com base na categoria
    switch (eventCategory) {
      case "Trabalho":
        eventElement.style.backgroundColor = "blue";
        eventElement.style.color = "white";
        break;
      case "Pessoal":
        eventElement.style.backgroundColor = "yellow";
        break;
      case "Escolar":
        eventElement.style.backgroundColor = "green";
        eventElement.style.color = "white";
        break;
      case "Outro":
        eventElement.style.backgroundColor = "black";
        eventElement.style.color = "white";
        break;
      default:
        eventElement.style.backgroundColor = "grey";
    }

    // Criar botão de exclusão ('X')
    const deleteButton = document.createElement("span");
    deleteButton.textContent = "X";
    deleteButton.classList.add("delete-event");
    deleteButton.onclick = async function (e) {
      e.stopPropagation();
      const eventId = evento.id; // Substitua por como o ID do evento é obtido
      if (confirm("Deseja deletar este evento?")) {
        await deletarEvento(eventId);
        eventElement.remove();
      }
    };

    try {
      const selectedDate = selectedDayElement.selectedDate.toISOString();

      const response = await fetch("http://localhost:3001/eventos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: eventName,
          data: selectedDate, // ou uma data específica
          categoria: eventCategory,
          concluido: false, // ou um valor apropriado
        }),
      });

      const eventData = await response.json();
    } catch (error) {
      alert("Erro ao adicionar evento:", error);
      console.error("Erro ao adicionar evento:", error);
    }

    eventElement.appendChild(deleteButton);
    selectedDayElement.appendChild(eventElement);

    nomeEventoInput.value = "";
    categoriaEventoInput.value = "";
    closeModal();
  }

  async function deletarEvento(eventoId) {
    try {
      const response = await fetch(
        `http://localhost:3003/eventos/${eventoId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao deletar evento: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error("Erro na exclusão do evento:", error);
    }
  }

  function updateMonthDisplay() {
    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
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

  function closeModal() {
    modal.style.display = "none";
  }

  window.onclick = function (event) {
    if (event.target === modal) {
      closeModal();
    }
  };

  updateMonthDisplay();
  generateCalendar();
});
