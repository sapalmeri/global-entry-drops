// ELEMENTS
const locationIdElement = document.getElementById("locationId")
const startDateElement = document.getElementById("startDate")
const endDateElement = document.getElementById("endDate")

// Button elements
const startButton = document.getElementById("startButton")
const stopButton = document.getElementById("stopButton")

// Span Listeners
const runningSpan = document.getElementById("runningSpan")
const stoppedSpan = document.getElementById("stoppedSpan")

// Error Message
const locationIdError = document.getElementById("locationIdError")
const startDateError = document.getElementById("startDateError")
const endDateError = document.getElementById("endDateError")

const hideElement = (elem) => {
  elem.style.display = 'none'
}

const showElement = (elem) => {
  elem.style.display = ''
}

const disableElement = (elem) => {
  elem.disabled = true
}

const enableElement = (elem) => {
  elem.disabled = false
}

const handleOnStartState = () => {
  // Spans
  showElement(runningSpan)
  hideElement(stoppedSpan)
  // Buttons
  disableElement(startButton)
  enableElement(stopButton)
}

const handleOnStopState = () => {
  // Spans
  showElement(stoppedSpan)
  hideElement(runningSpan)
  // Buttons
  disableElement(stopButton)
  enableElement(startButton)
}

const performOnStartValidations = () => {
  if (!locationIdElement.value) {
    showElement(locationIdError)
  } else {
    hideElement(locationIdError)
  }

  if (!startDateElement.value) {
    showElement(startDateError)
  } else {
    hideElement(startDateError)
  }

  if (!endDateElement.value) {
    showElement(endDateError)
  } else {
    hideElement(endDateError)
  }

  return locationIdElement.value && startDateElement.value && endDateElement.value
}

startButton.onclick = () => {
  const allFieldsValid = performOnStartValidations();

  if (allFieldsValid) {
    handleOnStartState();
    const prefs = {
      locationId: locationIdElement.value,
      startDate: startDateElement.value,
      endDate: endDateElement.value,
      tzData: locationIdElement.options[locationIdElement.selectedIndex].getAttribute('data-tz')
    }
    chrome.runtime.sendMessage({ event: 'onStart', prefs })
  }
}

stopButton.onclick = () => {
  handleOnStopState();
  chrome.runtime.sendMessage({ event: 'onStop' })
}

chrome.storage.local.get(["locationId", "startDate", "endDate", "locations", "isRunning"], (result) => {
  const { locationId, startDate, endDate, locations, isRunning } = result;

  setLocations(locations);

  if (locationId) {
    locationIdElement.value = locationId
  }
  if (startDate) {
    startDateElement.value = startDate
  }
  if (endDate) {
    endDateElement.value = endDate
  }

  if (isRunning) {
    handleOnStartState();
  } else {
    handleOnStopState();
  }
})

// {
//   "id": 5005,
//   "name": "El Paso Enrollment Center",
//   "shortName": "El Paso Enrollment Center",
//   "tzData": "America/Denver"
// }

const setLocations = (locations) => {
  locations.forEach(location => {
    let optionElement = document.createElement("option");
    optionElement.value = location.id
    optionElement.innerHTML = location.name
    optionElement.setAttribute('data-tz', location.tzData)
    locationIdElement.appendChild(optionElement)
  })
}