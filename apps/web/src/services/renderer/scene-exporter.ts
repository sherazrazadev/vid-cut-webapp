import EventEmitter from "eventemitter3";

import {
	Output,
	Mp4OutputFormat,
	WebMOutputFormat,
	BufferTarget,
	CanvasSource,
	AudioBufferSource,
	QUALITY_LOW,
	QUALITY_MEDIUM,
	QUALITY_HIGH,
	QUALITY_VERY_HIGH,
} from "mediabunny";
import type { FrameRate } from "opencut-wasm";
import { mediaTimeToSeconds } from "opencut-wasm";
import { TICKS_PER_SECOND } from "@/wasm";
import { frameRateToFloat } from "@/fps/utils";
import type { RootNode } from "./nodes/root-node";
import type { ExportFormat, ExportQuality, ExportVideoCodec } from "@/export";
import { getDefaultVideoCodec } from "@/export";
import { CanvasRenderer } from "./canvas-renderer";

type ExportParams = {
	width: number;
	height: number;
	outputWidth?: number;
	outputHeight?: number;
	fps: FrameRate;
	format: ExportFormat;
	quality: ExportQuality;
	videoCodec?: ExportVideoCodec;
	shouldIncludeAudio?: boolean;
	audioOnly?: boolean;
	audioBuffer?: AudioBuffer;
};

const qualityMap = {
	low: QUALITY_LOW,
	medium: QUALITY_MEDIUM,
	high: QUALITY_HIGH,
	very_high: QUALITY_VERY_HIGH,
};

export type SceneExporterEvents = {
	progress: [progress: number];
	complete: [buffer: ArrayBuffer];
	error: [error: Error];
	cancelled: [];
};

export class SceneExporter extends EventEmitter<SceneExporterEvents> {
	private renderer: CanvasRenderer;
	private format: ExportFormat;
	private quality: ExportQuality;
	private videoCodec: ExportVideoCodec;
	private outputWidth: number;
	private outputHeight: number;
	private shouldIncludeAudio: boolean;
	private audioOnly: boolean;
	private audioBuffer?: AudioBuffer;

	private isCancelled = false;

	constructor({
		width,
		height,
		outputWidth,
		outputHeight,
		fps,
		format,
		quality,
		videoCodec,
		shouldIncludeAudio,
		audioOnly,
		audioBuffer,
	}: ExportParams) {
		super();
		this.renderer = new CanvasRenderer({
			width,
			height,
			fps,
		});

		this.format = format;
		this.quality = quality;
		this.videoCodec = videoCodec ?? getDefaultVideoCodec({ format });
		this.outputWidth = outputWidth ?? width;
		this.outputHeight = outputHeight ?? height;
		this.shouldIncludeAudio = shouldIncludeAudio ?? false;
		this.audioOnly = audioOnly ?? false;
		this.audioBuffer = audioBuffer;
	}

	private createEncodeCanvas(): HTMLCanvasElement {
		const canvas = document.createElement("canvas");
		canvas.width = this.outputWidth;
		canvas.height = this.outputHeight;
		return canvas;
	}

	cancel(): void {
		this.isCancelled = true;
	}

	async export({
		rootNode,
	}: {
		rootNode: RootNode;
	}): Promise<ArrayBuffer | null> {
		const fps = this.renderer.fps;
		const fpsFloat = frameRateToFloat(fps);
		const ticksPerFrame = Math.round(
			(TICKS_PER_SECOND * fps.denominator) / fps.numerator,
		);
		const frameCount = Math.floor(rootNode.duration / ticksPerFrame);

		const outputFormat =
			this.format === "webm" ? new WebMOutputFormat() : new Mp4OutputFormat();

		const output = new Output({
			format: outputFormat,
			target: new BufferTarget(),
		});

		const needsScale =
			!this.audioOnly &&
			(this.outputWidth !== this.renderer.width ||
				this.outputHeight !== this.renderer.height);
		const encodeCanvas = needsScale
			? this.createEncodeCanvas()
			: this.renderer.getOutputCanvas();
		const encodeCtx = needsScale
			? (encodeCanvas as HTMLCanvasElement).getContext("2d")
			: null;

		let videoSource: CanvasSource | null = null;
		if (!this.audioOnly) {
			videoSource = new CanvasSource(encodeCanvas, {
				codec: this.videoCodec,
				bitrate: qualityMap[this.quality],
			});
			output.addVideoTrack(videoSource, { frameRate: fpsFloat });
		}

		let audioSource: AudioBufferSource | null = null;
		if (this.shouldIncludeAudio && this.audioBuffer) {
			let audioCodec: "aac" | "opus" = this.format === "webm" ? "opus" : "aac";

			if (audioCodec === "aac" && typeof AudioEncoder !== "undefined") {
				const { supported } = await AudioEncoder.isConfigSupported({
					codec: "mp4a.40.2",
					sampleRate: this.audioBuffer.sampleRate,
					numberOfChannels: this.audioBuffer.numberOfChannels,
					bitrate: 192000,
				});
				if (!supported) audioCodec = "opus";
			}

			audioSource = new AudioBufferSource({
				codec: audioCodec,
				bitrate: qualityMap[this.quality],
			});
			output.addAudioTrack(audioSource);
		}

		await output.start();

		if (audioSource && this.audioBuffer) {
			await audioSource.add(this.audioBuffer);
			audioSource.close();
		}

		if (this.audioOnly) {
			if (this.isCancelled) {
				await output.cancel();
				this.emit("cancelled");
				return null;
			}
			this.emit("progress", 1);
			await output.finalize();
			const audioBuffer = output.target.buffer;
			if (!audioBuffer) {
				this.emit("error", new Error("Failed to export audio"));
				return null;
			}
			this.emit("complete", audioBuffer);
			return audioBuffer;
		}

		for (let i = 0; i < frameCount; i++) {
			if (this.isCancelled) {
				await output.cancel();
				this.emit("cancelled");
				return null;
			}

			const timeTicks = i * ticksPerFrame;
			const timeSeconds = mediaTimeToSeconds({ time: timeTicks });
			await this.renderer.render({ node: rootNode, time: timeTicks });
			if (encodeCtx && needsScale) {
				encodeCtx.drawImage(
					this.renderer.getOutputCanvas(),
					0,
					0,
					this.outputWidth,
					this.outputHeight,
				);
			}
			await videoSource?.add(timeSeconds, 1 / fpsFloat);

			this.emit("progress", i / frameCount);
		}

		if (this.isCancelled) {
			await output.cancel();
			this.emit("cancelled");
			return null;
		}

		videoSource?.close();
		await output.finalize();
		this.emit("progress", 1);

		const buffer = output.target.buffer;
		if (!buffer) {
			this.emit("error", new Error("Failed to export video"));
			return null;
		}

		this.emit("complete", buffer);
		return buffer;
	}
}
