/*********************************************************
 * Certificate to Arduino Converter
 *********************************************************/
const BUTTON_KEY = 'btnGenerate';
const CERT_FILE_KEY = "certFile";
const VARIABLE_NAME_KEY = "variableName";

(function () {
  console.log("Initializing JavaScript library");
  // Populate the form
  let arduinoVariable = localStorage.getItem(VARIABLE_NAME_KEY);
  document.getElementById(VARIABLE_NAME_KEY).value = arduinoVariable ? arduinoVariable : 'certfile';
  // Add event listeners
  document.getElementById(BUTTON_KEY).addEventListener('click', generateFile, false);
  document.getElementById(CERT_FILE_KEY).addEventListener('cancel', fileSelectionCancelled, false);
  document.getElementById(CERT_FILE_KEY).addEventListener('change', fileSelected, false);
  document.getElementById(VARIABLE_NAME_KEY).addEventListener('change', saveVariableName, false);
})();

function saveVariableName(event) {
  console.log(`Saving variable name: ${event.target.value}`);
  localStorage.setItem(VARIABLE_NAME_KEY, event.target.value);
}

function fileSelectionCancelled(event) {
  console.log(`Saving file selection cancelled`);
}

function fileSelected(event) {
  console.log(`File selected`);

  const outputField = document.getElementById('output');
  const file = event.target.files[0];
  if (file) {
    console.dir(file);
    const reader = new FileReader();
    reader.onload = function(event) {
      outputField.textContent = event.target.result;
    };
    reader.readAsText(file); // Read file as plain text
  } else {
    outputField.textContent = '';
  }

}

function generateFile(event) {
  event.preventDefault();
  console.log('Generating file');

  const fileList = document.getElementById(CERT_FILE_KEY).files;
  if (fileList.length > 0) {
    console.dir(fileList);
  } else {
    console.log('No file found.');
    alert('No file found.');
  }
}
