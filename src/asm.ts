const ffmpeg = require("ffmpeg.js/ffmpeg-mp4.js");

let file: File;

export function handleAsmFile() {
	const inputElement = document.getElementById("asm-file-input");
	inputElement?.addEventListener(
		"change",
		(ev: any) => (file = ev.target.files[0] as File),
		false
	);
}

export function convertAsm() {
	if (!file) {
		alert("Please select a file first.");
		return;
	}

	const formatInput = document.getElementById(
		"asm-format-input"
	) as HTMLSelectElement;
	const format = formatInput.options[formatInput.selectedIndex].text;
	const mimeType = formatInput.options[formatInput.selectedIndex].value;

	convertFile(file, format, mimeType);
}

function convertFile(file: File, format: string, mimeType: string) {
	performance.mark("start");

	const inputFileName = file.name;
	const outputFileName = inputFileName.split(".")[0] + "-converted." + format;

	let stdout = "";
	let stderr = "";

	file.arrayBuffer().then((buffer) => {
		const result = ffmpeg({
			MEMFS: [{ name: inputFileName, data: buffer }],
			arguments: ["-i", inputFileName, outputFileName],
			print: function (data: any) {
				stdout += data + "\n";
			},
			printErr: function (data: any) {
				stderr += data + "\n";
			},
			onExit: function (code: any) {
				console.info("Process exited with code " + code);
				console.info(stdout);
				console.error(stderr);
			},
		});

		const out = result.MEMFS[0];

		const blob = new Blob([out.data], { type: mimeType });
		const downloadUrl = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = downloadUrl;
		link.download = outputFileName;
		link.click();
		URL.revokeObjectURL(downloadUrl);

		performance.mark("end");
		const measure = performance.measure("test", "start", "end");

		document.getElementById(
			"asm-time"
		)!.innerText = `Duration: ${measure.duration.toFixed(2)} ms`;
	});
}
