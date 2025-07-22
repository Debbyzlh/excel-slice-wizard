import { useState } from "react";
import { Upload, Settings, RefreshCw, Download } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import SplitConfigComponent from "@/components/SplitConfig";
import ProcessingPage from "@/components/ProcessingPage";
import DownloadPage from "@/components/DownloadPage";

type Step = "upload" | "config" | "processing" | "download";

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

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [splitConfig, setSplitConfig] = useState<SplitConfigType | null>(null);
  const [taskResult, setTaskResult] = useState<TaskResult | null>(null);

  const handleFileUploaded = (file: UploadedFile) => {
    setUploadedFile(file);
    setCurrentStep("config");
  };

  const handleConfigSubmit = (config: SplitConfigType) => {
    setSplitConfig(config);
    setCurrentStep("processing");
  };

  const handleProcessingComplete = (result: TaskResult) => {
    setTaskResult(result);
    setCurrentStep("download");
  };

  const handleStartOver = () => {
    setUploadedFile(null);
    setSplitConfig(null);
    setTaskResult(null);
    setCurrentStep("upload");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Excel 拆分工具</h1>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-2">
            {[
              { step: "upload", label: "上传文件", icon: Upload },
              { step: "config", label: "配置拆分", icon: Settings },
              { step: "processing", label: "处理中", icon: RefreshCw },
              { step: "download", label: "下载结果", icon: Download },
            ].map((item, index) => {
              const isActive = currentStep === item.step;
              const isCompleted = 
                (currentStep === "config" && item.step === "upload") ||
                (currentStep === "processing" && ["upload", "config"].includes(item.step)) ||
                (currentStep === "download" && ["upload", "config", "processing"].includes(item.step));
              
              return (
                <div key={item.step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`
                      flex items-center justify-center w-12 h-12 rounded-full border-2 text-sm font-medium transition-all duration-300
                      ${isActive 
                        ? "border-primary bg-primary text-primary-foreground shadow-apple scale-110" 
                        : isCompleted
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-muted-foreground/30 text-muted-foreground"
                      }
                    `}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className={`mt-2 text-xs font-medium transition-colors ${
                      isActive ? "text-primary" : isCompleted ? "text-primary/70" : "text-muted-foreground"
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className={`w-12 h-0.5 mx-3 mt-[-24px] transition-colors ${
                      isCompleted ? "bg-primary" : "bg-muted-foreground/20"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === "upload" && (
            <FileUpload onFileUploaded={handleFileUploaded} />
          )}
          
          {currentStep === "config" && uploadedFile && (
            <SplitConfigComponent 
              file={uploadedFile} 
              onConfigSubmit={handleConfigSubmit}
              onBack={() => setCurrentStep("upload")}
            />
          )}
          
          {currentStep === "processing" && uploadedFile && splitConfig && (
            <ProcessingPage 
              file={uploadedFile}
              config={splitConfig}
              onComplete={handleProcessingComplete}
              onCancel={() => setCurrentStep("config")}
            />
          )}
          
          {currentStep === "download" && taskResult && (
            <DownloadPage 
              result={taskResult}
              onStartOver={handleStartOver}
              onBackToConfig={() => setCurrentStep("config")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;