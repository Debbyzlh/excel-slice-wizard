import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, RefreshCw, FileText, Archive, Eye } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface TaskResult {
  taskId: string;
  fileCount: number;
  totalSize: number;
}

interface DownloadPageProps {
  result: TaskResult;
  onStartOver: () => void;
}

const DownloadPage = ({ result, onStartOver }: DownloadPageProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const mockFiles = [
    { name: "员工名单_1.xlsx", size: "245 KB" },
    { name: "员工名单_2.xlsx", size: "238 KB" },
    { name: "员工名单_3.xlsx", size: "156 KB" },
  ];

  const handleDownload = () => {
    setIsDownloading(true);
    
    // 模拟下载延迟
    setTimeout(() => {
      // 创建模拟下载
      const link = document.createElement('a');
      link.href = '#';
      link.download = `拆分结果_${result.taskId}.zip`;
      link.click();
      setIsDownloading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">处理完成</h2>
        <p className="text-muted-foreground">
          已生成 {result.fileCount} 个文件
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Archive className="w-5 h-5 mr-2" />
              拆分结果
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  查看文件列表
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>生成的文件列表</DialogTitle>
                </DialogHeader>
                <div className="max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    {mockFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-primary" />
                          <div>
                            <div className="text-sm font-medium">{file.name}</div>
                            <div className="text-xs text-muted-foreground">{file.size}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{result.fileCount}</div>
              <div className="text-sm text-muted-foreground">生成文件数</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{(result.totalSize / 1024 / 1024).toFixed(1)} MB</div>
              <div className="text-sm text-muted-foreground">总文件大小</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button 
          size="lg" 
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          <Download className="w-5 h-5 mr-2" />
          {isDownloading ? "准备下载..." : "下载结果"}
        </Button>
        
        <Button 
          variant="outline" 
          size="lg"
          onClick={onStartOver}
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          重新开始
        </Button>
      </div>

      {isDownloading && (
        <div className="space-y-2">
          <Progress value={75} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">正在准备下载文件...</p>
        </div>
      )}
    </div>
  );
};

export default DownloadPage;