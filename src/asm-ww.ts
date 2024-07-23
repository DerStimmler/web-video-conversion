import workerFile from "ffmpeg.js/ffmpeg-worker-mp4.js?url";
import { downloadBlob } from "./utils";

let file: File;

export function handleAsmWWFile() {
	const inputElement = document.getElementById("asm-ww-file-input");
	inputElement?.addEventListener(
		"change",
		(ev: Event) => {
			const input = ev.target as HTMLInputElement;
			file = input.files![0] as File;
		},
		false
	);
}

export function convertAsmWW() {
	if (!file) {
		alert("Please select a file first.");
		return;
	}

	updateState("Preparing...");

	const formatInput = document.getElementById(
		"asm-ww-format-input"
	) as HTMLSelectElement;
	const format = formatInput.options[formatInput.selectedIndex].text;
	const mimeType = formatInput.options[formatInput.selectedIndex].value;

	convertFile(file, format, mimeType);
}

function convertFile(file: File, format: string, mimeType: string) {
	const inputFileName = file.name;
	const outputFileName = inputFileName.split(".")[0] + "-converted." + format;

	let stdout = "";
	let stderr = "";

	updateState("Converting...");

	performance.mark("start");

	file.arrayBuffer().then((buffer) => {
		const worker = new Worker(workerFile);

		worker.onmessage = function (e) {
			const msg = e.data;
			switch (msg.type) {
				case "ready":
					worker.postMessage({
						type: "run",
						arguments: ["-i", inputFileName, outputFileName],
						MEMFS: [{ name: inputFileName, data: buffer }],
					});
					break;
				case "stdout":
					stdout += msg.data + "\n";
					break;
				case "stderr":
					stderr += msg.data + "\n";
					break;
				case "done":
					console.info(stdout);
					console.log(stderr);

					const out = msg.data.MEMFS[0];

					performance.mark("end");

					downloadBlob([out.data], mimeType, outputFileName);

					worker.terminate();

					const measure = performance.measure("test", "start", "end");

					updateState(`Duration: ${measure.duration.toFixed(2)} ms`);
					break;
			}
		};
	});
}

function updateState(state: string) {
	document.getElementById("asm-ww-state")!.innerText = state;
}
