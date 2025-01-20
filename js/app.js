/*********************************************************
 * Certificate to Arduino Converter
 *********************************************************/

const DEBUG_MODE = false;

const BLANK_STR = '';
const BUTTON_KEY = 'btnGenerate';
const CERT_FILE_KEY = "certFile";
const OUTPUT_KEY = "output";
const VARIABLE_NAME_KEY = "variableName";

let certContent;

(function () {
  console.log("Initializing JavaScript code");
  // Add event listeners
  document.getElementById(VARIABLE_NAME_KEY).addEventListener('change', saveVariableName, false);
  document.getElementById(VARIABLE_NAME_KEY).addEventListener('input', setButtonState, false);
  document.getElementById(CERT_FILE_KEY).addEventListener('cancel', fileSelectionCancelled, false);
  document.getElementById(CERT_FILE_KEY).addEventListener('change', fileSelected, false);
  document.getElementById(CERT_FILE_KEY).addEventListener('change', setButtonState, false);
  document.getElementById(BUTTON_KEY).addEventListener('click', generateFile, false);

  // Populate the form
  let arduinoVariable = localStorage.getItem(VARIABLE_NAME_KEY);
  document.getElementById(VARIABLE_NAME_KEY).value = arduinoVariable ? arduinoVariable : 'certfile';

  certContent = BLANK_STR;
  setButtonState();
})();

function setButtonState() {
  const generateButton = document.getElementById(BUTTON_KEY);
  const variableName = document.getElementById(VARIABLE_NAME_KEY).value;
  if (DEBUG_MODE) {
    console.log("Setting button state");
    console.log(`Variable: "${variableName}"`);
    console.log(`output: "${certContent}"`);
  }
  generateButton.disabled = (variableName.length < 1 || certContent.length < 1);
}

function saveVariableName(event) {
  console.log(`Saving variable name: "${event.target.value}"`);
  localStorage.setItem(VARIABLE_NAME_KEY, event.target.value);
}

function fileSelectionCancelled(event) {
  console.log(`File selection cancelled`);
}

function fileSelected(event) {
  console.log(`File selection change`);
  const outputField = document.getElementById(OUTPUT_KEY);
  const file = event.target.files[0];
  if (file) {
    if (DEBUG_MODE) console.dir(file);
    const reader = new FileReader();
    // create the event code that loads the file into memory
    reader.onload = function (event) {
      // console.dir(event.target.result);
      certContent = event.target.result;
      outputField.value = event.target.result;
      setButtonState();
    };
    reader.readAsText(file); // Read file as plain text
  } else {
    certContent = BLANK_STR;
    outputField.value = BLANK_STR;
    setButtonState();
  }
}

function generateFile(event) {
  event.preventDefault();
  console.log('Generating file');

  const fileList = document.getElementById(CERT_FILE_KEY).files;
  const outputField = document.getElementById(OUTPUT_KEY);

  if (fileList.length > 0) {
    console.dir(fileList);
    console.log(outputField.value);
  } else {
    console.log('No file found.');

  }
}
