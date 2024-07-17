import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

let ffmpeg: FFmpeg | null = null;

let file: File;

export function handleWasmFile() {
	const inputElement = document.getElementById("wasm-file-input");
	inputElement?.addEventListener(
		"change",
		(ev: any) => (file = ev.target.files[0] as File),
		false
	);
}

export async function convertWasm() {
	if (!file) {
		alert("Please select a file first.");
		return;
	}

	const formatInput = document.getElementById(
		"wasm-format-input"
	) as HTMLSelectElement;
	const format = formatInput.options[formatInput.selectedIndex].text;
	const mimeType = formatInput.options[formatInput.selectedIndex].value;

	await convertFile(file, format, mimeType);
}

async function convertFile(file: File, format: string, mimeType: string) {

	const inputFileName = file.name;
	const outputFileName = inputFileName.split(".")[0] + "-converted." + format;

	if (ffmpeg === null) {
		const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
		ffmpeg = new FFmpeg();
		ffmpeg.on("log", ({ message }) => {
			console.log(message);
		});
		ffmpeg.on("progress", ({ progress }) => {
			console.log(`${progress * 100} %`);
		});
		await ffmpeg.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
			wasmURL: await toBlobURL(
				`${baseURL}/ffmpeg-core.wasm`,
				"application/wasm"
			),
		});
	}
	performance.mark("start");

	await ffmpeg.writeFile(inputFileName, await fetchFile(file));
	console.log("Start transcoding");
	await ffmpeg.exec(["-i", inputFileName, outputFileName]);
	console.log("Complete transcoding");
	const data = await ffmpeg.readFile(outputFileName);

	performance.mark("end");

	const blob = new Blob([data], { type: mimeType });
	const downloadUrl = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = downloadUrl;
	link.download = outputFileName;
	link.click();
	URL.revokeObjectURL(downloadUrl);

	const measure = performance.measure("test", "start", "end");

	document.getElementById(
		"wasm-time"
	)!.innerText = `Duration: ${measure.duration.toFixed(2)} ms`;
}