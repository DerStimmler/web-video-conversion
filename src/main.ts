import "./style.css";

const ffmpeg = require("ffmpeg.js/ffmpeg-mp4.js");

const inputElement = document.getElementById("file-input");
inputElement?.addEventListener("change", handleFiles, false);
function handleFiles(this: HTMLElement, ev: any) {
	performance.mark("start");

	const file = ev.target.files[0] as File;

	let stdout = "";
	let stderr = "";

	file.arrayBuffer().then((buffer) => {
		const result = ffmpeg({
			MEMFS: [{ name: "test.mp4", data: buffer }],
			arguments: ["-i", "test.mp4", "out.mp3"],
			print: function (data) {
				stdout += data + "\n";
			},
			printErr: function (data) {
				stderr += data + "\n";
			},
			onExit: function (code) {
				console.log("Process exited with code " + code);
				console.log(stdout);
				console.log(stderr);
			},
		});

		const out = result.MEMFS[0];

		const pdfBlob = new Blob([out.data], { type: "audio/mp3" });
		const downloadUrl = URL.createObjectURL(pdfBlob);
		const link = document.createElement("a");
		link.href = downloadUrl;
		link.download = "out.mp3";
		link.click();
		URL.revokeObjectURL(downloadUrl);

		performance.mark("end");
		const measure = performance.measure("test", "start", "end");
		console.log(measure);
	});
}
