import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  sheets: string[];
}

interface FileUploadProps {
  onFileUploaded: (file: UploadedFile) => void;
}

const FileUpload = ({ onFileUploaded }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // 验证文件类型
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
      toast({
        title: "文件格式错误",
        description: "请上传 .xlsx 或 .xls 格式的Excel文件",
        variant: "destructive",
      });
      return;
    }

    // 验证文件大小 (50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "文件过大",
        description: "文件大小不能超过 50MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadProgress(100);
      
      // 模拟解析Excel文件获取工作表信息
      const mockSheets = ["Sheet1", "数据表", "统计表", "明细表"];
      const uploadedFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        sheets: mockSheets,
      };

      setTimeout(() => {
        onFileUploaded(uploadedFile);
      }, 500);

      toast({
        title: "上传成功",
        description: `文件 ${file.name} 上传完成`,
      });

    } catch (error) {
      toast({
        title: "上传失败",
        description: "文件上传过程中发生错误，请重试",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, [onFileUploaded, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">上传 Excel 文件</h2>
        <p className="text-muted-foreground">
          支持 .xlsx 和 .xls 格式，文件大小不超过 50MB
        </p>
      </div>

      <Card className="mx-auto max-w-2xl">
        <CardContent className="p-6">
          {!uploading ? (
          <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300
                ${isDragActive || dragActive
                  ? "border-primary bg-primary/5 shadow-apple scale-[1.02]" 
                  : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30 hover:shadow-card"
                }
              `}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              
              {isDragActive ? (
                <p className="text-lg font-medium text-primary">松开鼠标上传文件</p>
              ) : (
                <>
                  <p className="text-lg font-medium text-foreground mb-2">
                    点击或拖拽文件到此处上传
                  </p>
                  <p className="text-sm text-muted-foreground">
                    支持 .xlsx、.xls 格式，最大 50MB
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <File className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">正在上传...</span>
              </div>
              
              <Progress value={uploadProgress} className="w-full" />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{uploadProgress.toFixed(0)}% 完成</span>
                <span>请稍候...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>上传的文件仅用于处理，不会保存在服务器上</p>
      </div>
    </div>
  );
};

export default FileUpload;