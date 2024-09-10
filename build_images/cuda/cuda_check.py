import onnxruntime as ort

# 获取 ONNX Runtime 中可用的执行提供者
available_providers = ort.get_available_providers()

# 检查 CUDAExecutionProvider 是否可用
if 'CUDAExecutionProvider' in available_providers:
    print("CUDAExecutionProvider is available.")
else:
    print("CUDAExecutionProvider is not available.")

import sys

# 尝试导入 lzma 模块，检测是否正常
try:
    import lzma
    print("lzma module is available.")
except ImportError:
    print("lzma module is not available. Please check your Python installation.")
    sys.exit(1)  # 退出程序，因为没有 lzma 支持