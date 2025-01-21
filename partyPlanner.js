const COHORT = "2412-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;
const eventsList = document.querySelector("#events");
const newEventForm = document.querySelector("#addEvent");

const state = {
  events: [],
};

async function getEvents() {
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      const data = await response.json();
      state.events = data.data;
      renderEvents();
    } else {
      console.error("Failed to get events.");
    }
  } catch (err) {
    console.error(err);
  }
}

async function addEvent(event) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    if (response.ok) {
      const newEvent = await response.json();
      state.events.push(newEvent.data);
      renderEvents();
    } else {
      console.error("Failed to add event.");
    }
  } catch (err) {
    console.error(err);
  }
}

async function deleteEvent(eventId) {
  try {
    const response = await fetch(`${API_URL}/${eventId}`, {
      method: "DELETE",
    });
    if (response.status === 204) {
      state.events = state.events.filter((event) => event.id !== eventId);
      renderEvents();
    } else {
      console.error("Failed to delete event.");
    }
  } catch (err) {
    console.error(err);
  }
}

function renderEvents() {
  eventsList.innerHTML = "";

  state.events.forEach((event) => {
    const li = document.createElement("li");
    li.setAttribute("data-id", event.id);
    li.textContent = `${event.name} - ${event.date} at ${event.location}. Description: ${event.description}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      deleteEvent(event.id);
    });

    li.appendChild(deleteButton);
    eventsList.appendChild(li);
  });
}

newEventForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const newEvent = {
    name: newEventForm.eventName.value,
    date: newEventForm.date.value,
    location: newEventForm.location.value,
    description: newEventForm.description.value,
  };

  newEventForm.reset();

  await addEvent(newEvent);
});

getEvents();
