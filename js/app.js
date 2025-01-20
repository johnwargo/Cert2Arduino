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
  document.getElementById(VARIABLE_NAME_KEY).value = arduinoVariable ? arduinoVariable : 'cert';
  // initialize the cert content value. Since the field is read-only, I can't pull the value
  // from the `textarea` using JavaScript. So I added this variable to maintain state for me
  certContent = BLANK_STR;
  // disable the Generate button
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
  if (DEBUG_MODE) console.log(`Saving variable name: "${event.target.value}"`);
  localStorage.setItem(VARIABLE_NAME_KEY, event.target.value);
}

function fileSelectionCancelled(event) {
  if (DEBUG_MODE) console.log(`File selection cancelled`);
}

function fileSelected(event) {
  if (DEBUG_MODE) console.log(`File selection change`);
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

async function generateFile(event) {
  const slash = String.fromCharCode(92);
  const cr = String.fromCharCode(13);

  event.preventDefault();
  console.log(`Generating Arduino header file`);
  // pull the variable name off the form to use as the root of the file name
  const variableName = document.getElementById(VARIABLE_NAME_KEY).value;
  // convert the certificate data into an array
  let outputArray = certContent.split("\n");
  // remove any empty lines from the array
  outputArray = outputArray.filter((line) => line.length > 1);
  if (DEBUG_MODE) console.dir(outputArray);

  // controls the SaveFile dialog that appears
  const pickerOpts = {
    excludeAcceptAllOption: true,
    multiple: false,
    suggestedName: `${variableName}.h`,
    types: [
      {
        description: "Arduino Header Files",
        accept: {"text/plain": [".h"]},
      },
    ]
  };
  // get the output file path
  const fileHandle = await window.showSaveFilePicker(pickerOpts);
  const writableFileStream = await fileHandle.createWritable();
  // write the first line of the file
  await writableFileStream.write(`const char* ${variableName}= ` + slash + cr);
  // now loop through the array and write each line to the file
  let fileEnd = outputArray.length - 1;
  for (let i = 0; i < outputArray.length; i++) {
    // get the current line
    let line = outputArray[i];
    // remove any line breaks from the line
    line = line.replace(/(\r\n|\n|\r)/gm, "")
    // now rebuild the line like we want it to be
    await writableFileStream.write('"' + line + slash + 'n" ');
    if (i < fileEnd) {
      // add the slash to every line except the last one
      await writableFileStream.write(slash);
    }
    // always end with a carriage return
    await writableFileStream.write(cr);
  }
  // Close the writable stream - its content is now persisted to the file on disk
  await writableFileStream.close();
}
