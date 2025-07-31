import { useState, useEffect } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  sheets: string[];
}

interface SplitConfigType {
  selectedSheets: string[];
  splitType: "rows" | "columns" | "condition";
  rowsPerFile?: number;
  selectedColumns?: string[];
  conditionColumn?: string;
  namingRule: string;
}

interface TaskResult {
  taskId: string;
  fileCount: number;
  totalSize: number;
}

interface ProcessingPageProps {
  file: UploadedFile;
  config: SplitConfigType;
  onComplete: (result: TaskResult) => void;
  onCancel: () => void;
}

const ProcessingPage = ({ file, config, onComplete, onCancel }: ProcessingPageProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("准备中...");
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const simulateProcessing = async () => {
      try {
        const steps = [
          { step: "读取文件...", duration: 1000 },
          { step: "解析工作表...", duration: 1500 },
          { step: "拆分数据...", duration: 3000 },
          { step: "生成文件...", duration: 2000 },
          { step: "打包压缩...", duration: 1000 },
        ];

        let totalProgress = 0;
        const progressPerStep = 100 / steps.length;

        for (let i = 0; i < steps.length; i++) {
          setCurrentStep(steps[i].step);
          
          // 模拟步骤内的进度
          const stepStartProgress = totalProgress;
          const stepEndProgress = stepStartProgress + progressPerStep;
          
          const stepDuration = steps[i].duration;
          const progressInterval = setInterval(() => {
            setProgress(prev => {
              const newProgress = Math.min(prev + (progressPerStep / (stepDuration / 100)), stepEndProgress);
              return newProgress;
            });
          }, 100);

          await new Promise(resolve => setTimeout(resolve, stepDuration));
          clearInterval(progressInterval);
          
          totalProgress = stepEndProgress;
          setProgress(totalProgress);
        }

        setCurrentStep("完成!");
        setProcessing(false);

        // 模拟结果
        const result: TaskResult = {
          taskId: Math.random().toString(36).substr(2, 9),
          fileCount: config.selectedSheets.length * (config.splitType === "rows" ? 3 : 1),
          totalSize: file.size * 0.8,
        };

        setTimeout(() => {
          onComplete(result);
        }, 1000);

        toast({
          title: "处理完成",
          description: `成功生成 ${result.fileCount} 个文件`,
        });

      } catch (err) {
        setError("处理过程中发生错误，请重试");
        setProcessing(false);
      }
    };

    simulateProcessing();
  }, [file, config, onComplete, toast]);

  const handleCancel = () => {
    setProcessing(false);
    onCancel();
  };

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
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {processing ? "正在处理" : "处理完成"}
        </h2>
        <p className="text-muted-foreground">
          请稍候，正在为您拆分Excel文件...
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>处理进度</span>
            {processing && (
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 文件信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">文件名：</span>
              <span className="font-medium">{file.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">文件大小：</span>
              <span className="font-medium">{formatFileSize(file.size)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">拆分方式：</span>
              <span className="font-medium">
                {config.splitType === "rows" ? `按行拆分 (${config.rowsPerFile}行/文件)` :
                 config.splitType === "columns" ? "按列拆分" : "按条件拆分"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">工作表：</span>
              <span className="font-medium">{config.selectedSheets.join(", ")}</span>
            </div>
          </div>

          {/* 进度条 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">{currentStep}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* 状态指示器 */}
          <div className="flex items-center justify-center space-x-2">
            {processing ? (
              <>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">处理中...</span>
              </>
            ) : error ? (
              <>
                <AlertCircle className="h-5 w-5 text-destructive" />
                <span className="text-sm text-destructive">处理失败</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-600">处理完成</span>
              </>
            )}
          </div>

          {/* 错误信息 */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* 操作按钮 */}
          {!processing && (
            <div className="flex justify-center space-x-4">
              {error ? (
                <Button onClick={onCancel}>
                  返回重试
                </Button>
              ) : (
                <Button onClick={() => window.location.reload()}>
                  继续到下载页面
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 温馨提示 */}
      <div className="text-center text-sm text-muted-foreground max-w-md mx-auto">
        <p>处理时间取决于文件大小和拆分复杂度，请耐心等待。</p>
        <p className="mt-1">如需取消，请点击右上角的 × 按钮。</p>
      </div>
    </div>
  );
};

export default ProcessingPage;