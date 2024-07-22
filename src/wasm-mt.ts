import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { downloadBlob } from "./utils";

let ffmpeg: FFmpeg | null = null;

let file: File;

export function handleWasmMtFile() {
	const inputElement = document.getElementById("wasm-mt-file-input");
	inputElement?.addEventListener(
		"change",
		(ev: any) => (file = ev.target.files[0] as File),
		false
	);
}

export async function convertWasmMt() {
	if (!file) {
		alert("Please select a file first.");
		return;
	}

	if (!window.crossOriginIsolated) {
		alert(
			"Cross origin isolation is not enabled on GitHub pages. Run the project locally to use Multi-Threading."
		);
		return;
	}

	const formatInput = document.getElementById(
		"wasm-mt-format-input"
	) as HTMLSelectElement;
	const format = formatInput.options[formatInput.selectedIndex].text;
	const mimeType = formatInput.options[formatInput.selectedIndex].value;

	await convertFile(file, format, mimeType);
}

async function convertFile(file: File, format: string, mimeType: string) {
	const inputFileName = file.name;
	const outputFileName = inputFileName.split(".")[0] + "-converted." + format;

	if (ffmpeg === null) {
		const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";
		ffmpeg = new FFmpeg();
		ffmpeg.on("log", ({ message }) => {
			console.log(message);
		});
		ffmpeg.on("progress", ({ progress }) => {
			updateState(`Progress: ${progress * 100} %`);
		});
		await ffmpeg.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
			wasmURL: await toBlobURL(
				`${baseURL}/ffmpeg-core.wasm`,
				"application/wasm"
			),
			workerURL: await toBlobURL(
				`${baseURL}/ffmpeg-core.worker.js`,
				"text/javascript"
			),
		});
	}
	performance.mark("start");

	await ffmpeg.writeFile(inputFileName, await fetchFile(file));
	console.log("Start transcoding");
	await ffmpeg.exec(["-threads", "4", "-i", inputFileName, outputFileName]);
	console.log("Complete transcoding");
	const data = await ffmpeg.readFile(outputFileName);

	performance.mark("end");

	downloadBlob([data], mimeType, outputFileName);

	const measure = performance.measure("test", "start", "end");

	updateState(`Duration: ${measure.duration.toFixed(2)} ms`);
}

function updateState(state: string) {
	document.getElementById("wasm-mt-state")!.innerText = state;
}
