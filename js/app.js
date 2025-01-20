const VARIABLE_NAME_KEY = "variableName";

(function () {
  console.log("Initializing JavaScript library");
  let arduinoVariable = localStorage.getItem(VARIABLE_NAME_KEY);
  if (arduinoVariable) document.getElementById(VARIABLE_NAME_KEY).value = arduinoVariable;
})();
