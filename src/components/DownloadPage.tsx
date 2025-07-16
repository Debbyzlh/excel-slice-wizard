import { useState } from "react";
import { Download, RefreshCw, CheckCircle, FileArchive, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

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
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = async () => {
    setDownloading(true);
    
    try {
      // 模拟下载过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 在实际应用中，这里会发起真实的下载请求
      // const response = await fetch(`/api/download/${result.taskId}`);
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `拆分结果_${result.taskId}.zip`;
      // a.click();
      
      setDownloadComplete(true);
      toast({
        title: "下载完成",
        description: "文件已成功下载到您的设备",
      });
      
    } catch (error) {
      toast({
        title: "下载失败",
        description: "下载过程中发生错误，请重试",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mb-4">
          <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">拆分完成！</h2>
        <p className="text-muted-foreground">
          您的Excel文件已成功拆分，可以下载结果文件了
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileArchive className="h-5 w-5" />
            <span>拆分结果</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 结果统计 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{result.fileCount}</div>
              <div className="text-sm text-muted-foreground">生成文件数</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{formatFileSize(result.totalSize)}</div>
              <div className="text-sm text-muted-foreground">总文件大小</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">ZIP</div>
              <div className="text-sm text-muted-foreground">压缩格式</div>
            </div>
          </div>

          <Separator />

          {/* 文件列表预览 */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">包含文件预览：</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {Array.from({ length: Math.min(result.fileCount, 5) }, (_, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-muted/20 rounded text-sm">
                  <span className="text-foreground">数据表_Sheet1_{String(i + 1).padStart(3, '0')}.xlsx</span>
                  <Badge variant="secondary" className="text-xs">
                    {formatFileSize(result.totalSize / result.fileCount)}
                  </Badge>
                </div>
              ))}
              {result.fileCount > 5 && (
                <div className="text-center text-sm text-muted-foreground">
                  ... 还有 {result.fileCount - 5} 个文件
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* 下载按钮 */}
          <div className="space-y-4">
            <Button 
              onClick={handleDownload} 
              disabled={downloading}
              size="lg"
              className="w-full"
            >
              {downloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  下载中...
                </>
              ) : downloadComplete ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  重新下载
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  下载 ZIP 文件
                </>
              )}
            </Button>

            {downloadComplete && (
              <div className="text-center text-sm text-green-600 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                文件已下载完成
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 操作选项 */}
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" onClick={onStartOver} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              处理新文件
            </Button>
            <Button variant="outline" className="flex-1">
              <Clock className="h-4 w-4 mr-2" />
              查看历史记录
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 温馨提示 */}
      <div className="text-center text-sm text-muted-foreground max-w-md mx-auto">
        <p>下载的ZIP文件包含所有拆分后的Excel文件。</p>
        <p className="mt-1">文件将在24小时后自动清理，请及时下载。</p>
      </div>
    </div>
  );
};

export default DownloadPage;