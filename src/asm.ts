import { downloadBlob } from "./utils";

const ffmpeg = require("ffmpeg.js/ffmpeg-mp4.js");

let file: File;

export function handleAsmFile() {
	const inputElement = document.getElementById("asm-file-input");
	inputElement?.addEventListener(
		"change",
		(ev: Event) => {
			const input = ev.target as HTMLInputElement;
			file = input.files![0] as File;
		},
		false
	);
}

export async function convertAsm() {
	if (!file) {
		alert("Please select a file first.");
		return;
	}

	updateState("Preparing...");

	const formatInput = document.getElementById(
		"asm-format-input"
	) as HTMLSelectElement;
	const format = formatInput.options[formatInput.selectedIndex].text;
	const mimeType = formatInput.options[formatInput.selectedIndex].value;

	await convertFile(file, format, mimeType);
}

async function convertFile(file: File, format: string, mimeType: string) {
	const inputFileName = file.name;
	const outputFileName = inputFileName.split(".")[0] + "-converted." + format;

	let stdout = "";
	let stderr = "";

	updateState("Converting...");

	performance.mark("start");

	const fileBuffer = await file.arrayBuffer();

	const result = ffmpeg({
		MEMFS: [{ name: inputFileName, data: fileBuffer }],
		arguments: ["-i", inputFileName, outputFileName],
		print: function (data: string) {
			stdout += data + "\n";
		},
		printErr: function (data: string) {
			stderr += data + "\n";
		},
		onExit: function (code: number) {
			console.info(stdout);
			console.log(stderr);
			console.log("Process exited with code " + code);
		},
	});

	const out = result.MEMFS[0];

	performance.mark("end");

	downloadBlob([out.data], mimeType, outputFileName);

	const measure = performance.measure("test", "start", "end");

	updateState(`Duration: ${measure.duration.toFixed(2)} ms`);
}

function updateState(state: string) {
	document.getElementById("asm-state")!.innerText = state;
}
