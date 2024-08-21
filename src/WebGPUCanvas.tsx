import React, { useEffect, useRef } from 'react';

export function WebGPUCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const initWebGPU = async () => {
      if (!navigator.gpu) {
        return console.error('이 브라우저에서는 WebGPU가 지원되지 않습니다');
      }

      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        return console.error('적절한 GPU adapter를 찾을 수 없습니다.');
      }

      const device = await adapter.requestDevice();
      const context = canvasRef.current?.getContext('webgpu') as GPUCanvasContext;

      if (!context) {
        return console.error('Failed to get WebGPU context.');
      }

      const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
      context.configure({
        device: device,
        format: canvasFormat
      });

      // 간단한 WebGPU 렌더링 코드
      const commandEncoder = device.createCommandEncoder();
      const textureView = context.getCurrentTexture().createView();
      const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [{
          view: textureView,
          loadOp: 'clear',
          storeOp: 'store'
        }]
      };

      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
      passEncoder.end()
      device.queue.submit([commandEncoder.finish()]);
    };

    initWebGPU();
  }, []);

  return <canvas ref={canvasRef} width={512} height={512} />;
};

export default WebGPUCanvas;

