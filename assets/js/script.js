let startButton = document.querySelector('.start');
let startMenu = document.querySelector('.start-menu');
let overlay = document.querySelector('.overlay')

let folder = document.querySelector('.projects-folder');
let initialX = 0,
	initialY = 0;
let moveElement = false;

//Events Object
let events = {
	mouse: {
		down: "mousedown",
		move: "mousemove",
		up: "mouseup",
	},
	touch: {
		down: "touchstart",
		move: "touchmove",
		up: "touchend",
	},
};

let deviceType = "";

//Detech touch device
const isTouchDevice = () => {
	try {
		//We try to create TouchEvent (it would fail for desktops and throw error)
		document.createEvent("TouchEvent");
		deviceType = "touch";
		return true;
	} catch (e) {
		deviceType = "mouse";
		return false;
	}
};

isTouchDevice();

//Start (mouse down / touch start)
folder.addEventListener(events[deviceType].down, e => {
	e.preventDefault();
	//initial x and y points
	initialX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
	initialY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;

	//Start movement
	moveElement = true;
});

//Move
folder.addEventListener(events[deviceType].move, e => {
	//if movement == true then set top and left to new X andY while removing any offset
	if (moveElement) {
		e.preventDefault();
		let newX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
		let newY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
		folder.style.top =
			folder.offsetTop - (initialY - newY) + "px";
		folder.style.left =
			folder.offsetLeft - (initialX - newX) + "px";
		initialX = newX;
		initialY = newY;
	}
});

//mouse up / touch end
folder.addEventListener(
	events[deviceType].up,
	(stopMovement = (e) => {
		moveElement = false;
	})
);

folder.addEventListener("mouseleave", stopMovement);
folder.addEventListener(events[deviceType].up, (e) => {
	moveElement = false;
});

startButton.onclick = () => {
	startMenu.classList.toggle('active');

	if (startMenu.classList.contains('active')) {
		overlay.classList.add('active')
	} else {
		overlay.classList.remove('active')
	}
}

overlay.addEventListener('click', () => {
	if (overlay.classList.contains('active')) {
		startMenu.classList.remove('active')
		overlay.classList.remove('active')
	}
})

/**************************************************************************************/
// Get all draggable elements using querySelectorAll
var draggableElements = document.querySelectorAll("#mydiv");

// Make the draggable elements draggable
draggableElements.forEach(function(elmnt) {
	dragElement(elmnt);
});

function dragElement(elmnt) {
	var pos1 = 0,
		pos2 = 0,
		pos3 = 0,
		pos4 = 0;
	var header = elmnt.querySelectorAll(".myivheader");

	header.forEach(header => {

		if (header) {
			// If present, the header is where you move the element from
			header.onmousedown = dragMouseDown;
		} else {
			// Otherwise, move the element from anywhere inside it
			elmnt.onmousedown = dragMouseDown;
		}

	})

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		// Get the mouse cursor position at startup
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// Call a function whenever the cursor moves
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// Calculate the new cursor position
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// Set the element's new position
		elmnt.style.top = elmnt.offsetTop - pos2 + "px";
		elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
	}

	function closeDragElement() {
		// Stop moving when the mouse button is released
		document.onmouseup = null;
		document.onmousemove = null;
	}
}

// Get all elements with the class "modal"
const modals = document.querySelectorAll('.pos-check');

// Attach click event listener to each modal
modals.forEach((modal) => {
	modal.addEventListener('click', function() {

		this.style.zIndex = 5;

		modals.forEach((m) => {
			if (m !== this) {
				m.style.zIndex = 0;
			}
		});
	});
});

//cmd
document.addEventListener("DOMContentLoaded", function() {
	const output = document.getElementById("output");
	const inputContainer = document.getElementById("inputContainer");
	const input = document.getElementById("input");
	const cursor = document.getElementById("cursor");
	const commandsHistory = [];
	let currentCommandIndex = -1;
	let ctrlPressed = false;
	let currentDirectory = "C:\\Users\\Paul";
	let currentLineDirectory = currentDirectory;

	function getCurrentDirectory() {
		// Display the current directory in the prompt
		return `${currentLineDirectory}>`;
	}
	let promptText = getCurrentDirectory();

	input.addEventListener("keydown", function(event) {
		if (event.key === "Enter") {
			event.preventDefault();
			const command = input.value.trim();
			input.value = "";

			// Add command to history
			if (command !== "") {
				commandsHistory.push(command);
				currentCommandIndex = commandsHistory.length;
			}

			if (command !== "") {
				const response = executeCommand(command);
				displayOutput(`${promptText}${command}\n${response}\n \n`);
			} else {
				displayOutput(`\n \n${promptText}`);
			}
			output.scrollTop = output.scrollHeight;
		} else if (event.key === "ArrowUp") {
			// Handle up arrow key to navigate command history
			event.preventDefault();
			if (currentCommandIndex > 0) {
				currentCommandIndex--;
				input.value = commandsHistory[currentCommandIndex];
			}
		} else if (event.key === "ArrowDown") {
			// Handle down arrow key to navigate command history
			event.preventDefault();
			if (currentCommandIndex < commandsHistory.length - 1) {
				currentCommandIndex++;
				input.value = commandsHistory[currentCommandIndex];
			} else {
				currentCommandIndex = commandsHistory.length;
				input.value = "";
			}
		} else if (event.key === "Control") {
			// Handle the Control key
			ctrlPressed = true;
		}
	});

	input.addEventListener("keyup", function(event) {
		if (event.key === "Control") {
			// Reset ctrlPressed flag when the Control key is released
			ctrlPressed = false;
		} else if (!ctrlPressed && event.key !== "Enter") {
			const inputValue = input.value;
			input.value = inputValue.replace(/\^/g, ""); // Remove any ^ characters from the input
		}
	});

	input.addEventListener("keypress", function(event) {
		if (ctrlPressed && event.key === "c") {
			// Handle Ctrl+C key combination
			event.preventDefault();
			displayOutput("\n");
		} else if (ctrlPressed && event.key !== "c") {
			// Handle Ctrl + letter key combination
			event.preventDefault();
			const key = event.key.toUpperCase();
			displayOutput(`^${key}`);
		}
	});

  input.addEventListener("keydown", function(event) {
    // ... (your existing keydown event code) ...
  
    // Handle tab key press for tab completion
     if (event.key === "Tab") {
      event.preventDefault();
      autoCompleteCd();
    }
  });
  
  function autoCompleteCd() {
    const currentInput = input.value.trim().split(" ");
    const command = currentInput[0];
    const directory = currentInput[1];
  
    if (command === "cd") {
      const matchingDirs = getMatchingDirectories(directory);
      if (matchingDirs.length === 1) {
        // If there's only one matching directory, auto-complete the cd command
        input.value = `cd ${matchingDirs[0]}`;
      } else if (matchingDirs.length > 1) {
        // If there are multiple matching directories, display the options
        displayOutput("\n");
        matchingDirs.forEach((dir) => {
          displayOutput(`${dir}\t`);
        });
        displayOutput("\n");
        displayOutput(promptText);
      }
    }
  }
  
  function getMatchingDirectories(directory) {
    // Implement logic to get the directories that match the input
    // For example, you can use the existing 'isDirectoryExists' function
    const existingDirectories = ["projects", "about", "languages"];
    return existingDirectories.filter((dir) => dir.startsWith(directory));
  }

	function displayOutput(text) {
		output.innerText += text;
		inputContainer.scrollIntoView(); // Scroll to the input
		input.focus();
	}

	function executeCommand(command) {
    const args = command.split(" ");
    const cmd = args[0].toLowerCase(); // Convert the command to lowercase
  
    switch (cmd) {
      case "help":
        return `Available commands:\nhelp <Provides Help information for Windows commands>\necho <Displays messages, or turns command echoing on or off>\npwd <Shows current directory>\nls <Displays a list of files and subdirectories in a directory>\ndir <Displays a list of files and subdirectories in a directory.>\ncd <Change directory: cd [dirname]>\ndate <Provides current date>\ntime <Provides current time>\nclear <Clears all previous commands>\nexit <Closes terminal>\nhistory <History of previous prompts>`.split(new RegExp(/\n/g)).sort().join('\n');
      case "echo":
        return args.slice(1).join(" ");
      case "pwd":
        return getCurrentDirectory();
      case "ls":
      case "dir": // Both "ls" and "dir" commands list files in the current directory
        return listFiles();
      case "cd":
        return changeDirectory(args[1]);
      case "date":
        return getCurrentDate();
      case "time":
        return getCurrentTime();
      case "clear":
      case "cls":
        return clearOutput();
      case "exit":
	  case "exit()":
        return closeTerminal(); // You can add additional functionality to handle cleanup here if needed
      case "history":
        return showCommandHistory();
      default:
        return `'${args}' is not recognized as an internal or external command,\noperable program or batch file.`;
    }
  }
  
	function closeTerminal() {
		// Hide the terminal container
		const terminalContainer = document.querySelector(".terminal");
		terminalContainer.style.display = "none";
	}

	function listFiles() {
		// List files based on the current directory
		switch (currentDirectory) {
			case "C:\\Users\\Paul\\projects":
				return "\ncalc.html\napp.js\ndocs.pdf";
			case "C:\\Users\\Paul\\about":
				return "\ncv.docx\nprofile.jpg";
			case "C:\\Users\\Paul\\languages":
				return "python.py\njava.java\ncpp.cpp";
			default:
				return "\nabout\nprojects\nlanguages"; // Empty string for directories without specific files
		}
	}

	function changeDirectory(directory) {
		if (directory === "..") {
			// Handle moving up to the parent directory (if not already at the root)
			const rootDirectory = "C:\\Users\\Paul"; // Replace this with the root directory
			if (currentDirectory !== rootDirectory) {
				const lastSlashIndex = currentDirectory.lastIndexOf("\\");
				currentDirectory = currentDirectory.slice(0, lastSlashIndex);
				currentLineDirectory = currentDirectory; // Update the current line directory
			}
		} else {
			// Handle moving into the specified directory
			const newDirectory = `${currentDirectory}\\${directory}`;
			// Check if the new directory exists
			if (isDirectoryExists(newDirectory)) {
				currentDirectory = newDirectory;
				currentLineDirectory = currentDirectory; // Update the current line directory
			} else {
				return `bash: cd: ${directory}: No such file or directory`;
			}
		}

		promptText = getCurrentDirectory();
		document.getElementById("prompt").textContent = promptText;
		return ""; // Return empty string for successful cd command (no output needed)
	}

	function isDirectoryExists(directory) {
		// You can replace this dummy implementation with your actual check for directory existence
		const existingDirectories = ["projects", "about", "languages"];
		if (existingDirectories.includes(directory.split("\\").pop())) {
			currentLineDirectory = directory; // Update the current line directory
			return true;
		}
		return false;
	}

	function getCurrentDate() {
		const currentDate = new Date();
		return currentDate.toDateString();
	}

	function getCurrentTime() {
		const currentTime = new Date();
		return currentTime.toTimeString();
	}

	function clearOutput() {
		output.innerText = "";
		return "";
	}

	function showCommandHistory() {
		let historyOutput = "";
		for (let i = 0; i < commandsHistory.length; i++) {
			historyOutput += `${i + 1}. ${commandsHistory[i]}\n`;
		}
		return historyOutput;
	}

	// Display the initial prompt
	displayOutput('');
});

//f(x).f'(x) > 0, when f(x) < 0 and f'(x) > 0

/*

UCT - BBusSc Computer Science, Bcom Computer Science with Information Systems, BSc Mathematical Statistics (Extended)

Wits - BSc Computer Science, BCom Information Systems, BCom Information Systems, BSc(Eng) Electrical Engineering

Rhodes University - BSc Computer Science, BBusSc Computer Science, BCom Information Systems

Walter Sisulu University - BSc Computer Science,  

*/

//Phys: 60% 5
//Math: 85% 7
//LO: 85%   7
//CAT: 80%  7
//ENG: 70%  6
//AFR: 60%  5
//LS: 65%   5
//Avg: 74%