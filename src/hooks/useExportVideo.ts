import { useState } from 'react';
import { useEditorStore } from '../store';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export function useExportVideo() {
  const [isExporting, setIsExporting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleExportVideo = async () => {
    const project = useEditorStore.getState().project;
    try {
      alert("Vui lòng chọn chia sẻ Thẻ (Tab) hiện tại và CHỌN CHIA SẺ ÂM THANH để tiến hành xuất video.");
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" },
        audio: true,
        preferCurrentTab: true
      } as any);

      let mimeType = 'video/webm';
      let isNativeMp4 = false;
      if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
        isNativeMp4 = true;
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
        mimeType = 'video/webm;codecs=h264';
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: BlobPart[] = [];
      
      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: mimeType });
        stream.getTracks().forEach(t => t.stop());
        
        if (isNativeMp4) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = project.title ? `${project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4` : 'sticktalk_video.mp4';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          setIsExporting(false);
          useEditorStore.getState().setIsExporting(false);
          return;
        }

        try {
          setIsConverting(true);
          setExportProgress(0);
          
          const ffmpeg = new FFmpeg();
          ffmpeg.on('progress', ({ progress }) => {
            setExportProgress(Math.round(progress * 100));
          });
          
          await ffmpeg.load({
            coreURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js",
            wasmURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm",
          });

          await ffmpeg.writeFile('input.webm', await fetchFile(blob));
          
          let args = ['-i', 'input.webm', '-c:v', 'libx264', '-preset', 'ultrafast', 'output.mp4'];
          if (mimeType.includes('h264')) {
            args = ['-i', 'input.webm', '-c:v', 'copy', 'output.mp4'];
          }
          
          await ffmpeg.exec(args);
          const data = await ffmpeg.readFile('output.mp4');
          
          const mp4Blob = new Blob([data], { type: 'video/mp4' });
          const url = URL.createObjectURL(mp4Blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = project.title ? `${project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4` : 'sticktalk_video.mp4';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
        } catch (err: any) {
          console.error("FFmpeg error", err);
          alert("Không thể chuyển đổi sang MP4 (có thể do thiết bị). Video sẽ được tải xuống ở định dạng WebM.");
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = project.title ? `${project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.webm` : 'sticktalk_video.webm';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } finally {
          setIsExporting(false);
          setIsConverting(false);
          useEditorStore.getState().setIsExporting(false);
          setExportProgress(0);
          useEditorStore.getState().setCurrentTime(0);
        }
      };

      recorder.start();
      setIsExporting(true);
      useEditorStore.getState().setIsExporting(true);
      
      useEditorStore.getState().setCurrentTime(0);
      if (!useEditorStore.getState().isPlaying) {
        useEditorStore.getState().togglePlay();
      }

      setTimeout(() => {
        if (recorder.state !== 'inactive') {
          recorder.stop();
        }
        if (useEditorStore.getState().isPlaying) {
          useEditorStore.getState().togglePlay();
        }
      }, (project.duration * 1000) + 1000); 
    } catch (err: any) {
      console.error("Lỗi xuất video", err);
      if (err.name === 'NotAllowedError' || err.message?.includes('not allowed')) {
        alert("Bạn đã hủy chia sẻ màn hình, hoặc trình duyệt không cho phép quay màn hình.");
      } else {
        alert("Có lỗi xảy ra khi xuất video: " + (err.message || err.toString()));
      }
      setIsExporting(false);
      useEditorStore.getState().setIsExporting(false);
    }
  };

  return { handleExportVideo, isExporting, isConverting, exportProgress };
}
