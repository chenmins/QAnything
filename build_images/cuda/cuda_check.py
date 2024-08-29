import onnxruntime as ort

# 获取 ONNX Runtime 中可用的执行提供者
available_providers = ort.get_available_providers()

# 检查 CUDAExecutionProvider 是否可用
if 'CUDAExecutionProvider' in available_providers:
    print("CUDAExecutionProvider is available.")
else:
    print("CUDAExecutionProvider is not available.")
