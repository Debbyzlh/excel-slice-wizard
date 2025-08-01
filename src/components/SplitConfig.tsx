import { useState } from "react";
import { ChevronLeft, FileText, Settings, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
  namingColumn?: string;
  headerRow?: number;
}

interface SplitConfigProps {
  file: UploadedFile;
  onConfigSubmit: (config: SplitConfigType) => void;
  onBack: () => void;
}

const SplitConfig = ({ file, onConfigSubmit, onBack }: SplitConfigProps) => {
  const [selectedSheets, setSelectedSheets] = useState<string[]>([file.sheets[0]]);
  const [conditionColumn, setConditionColumn] = useState("");
  const [namingColumn, setNamingColumn] = useState("");
  const [headerRow, setHeaderRow] = useState<number>(1);
  
  // 模拟列数据
  const mockColumns = ["A", "B", "C", "D", "E", "姓名", "部门", "职位", "薪资", "入职日期"];

  const handleSheetToggle = (sheetName: string) => {
    setSelectedSheets(prev => 
      prev.includes(sheetName) 
        ? prev.filter(s => s !== sheetName)
        : [...prev, sheetName]
    );
  };


  const getPreviewFileList = () => {
    if (selectedSheets.length === 0) return ["请选择至少一个工作表"];
    if (!conditionColumn) return ["请选择拆分列"];
    
    const fileNames: string[] = [];
    selectedSheets.forEach(sheet => {
      // 模拟基于拆分列的文件名
      const values = ["技术部", "市场部", "人事部"];
      values.forEach(value => {
        const fileName = namingColumn 
          ? `${sheet}_${value}.xlsx`
          : `${sheet}_${conditionColumn}_${value}.xlsx`;
        fileNames.push(fileName);
      });
    });
    
    return fileNames;
  };

  const handleSubmit = () => {
    if (selectedSheets.length === 0 || !conditionColumn) return;
    
    const config: SplitConfigType = {
      selectedSheets,
      splitType: "condition",
      conditionColumn,
      namingRule: "column",
      namingColumn: namingColumn || undefined,
      headerRow,
    };
    
    onConfigSubmit(config);
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
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-foreground">配置拆分方式</h2>
          <p className="text-muted-foreground">设置如何拆分你的Excel文件</p>
        </div>
      </div>

      {/* 文件信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>文件信息</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">文件名：</span>
              <span className="font-medium">{file.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">大小：</span>
              <span className="font-medium">{formatFileSize(file.size)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">工作表数：</span>
              <span className="font-medium">{file.sheets.length} 个</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="h-[60vh] overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pr-2">
          {/* 左侧配置列 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 选择工作表 */}
            <Card className="hover:shadow-card transition-shadow duration-300">
              <CardHeader>
                <CardTitle>选择工作表</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {file.sheets.map(sheet => (
                  <div key={sheet} className="flex items-center space-x-2">
                    <div
                      onClick={() => handleSheetToggle(sheet)}
                      className={`w-4 h-4 rounded-full border-2 cursor-pointer transition-all ${
                        selectedSheets.includes(sheet)
                          ? 'bg-apple-blue border-apple-blue'
                          : 'border-border bg-background'
                      }`}
                    />
                    <Label htmlFor={sheet} className="cursor-pointer">{sheet}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 选择Header行 */}
            <Card className="hover:shadow-card transition-shadow duration-300">
              <CardHeader>
                <CardTitle>选择Header行</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label className="text-sm">选择包含列标题的行</Label>
                  <Select value={headerRow.toString()} onValueChange={(value) => setHeaderRow(parseInt(value))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择Header行" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(row => (
                        <SelectItem key={row} value={row.toString()}>第 {row} 行</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 拆分列选择 */}
            <Card className="hover:shadow-card transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>选择拆分列</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label className="text-sm">选择用于拆分的列</Label>
                  <Select value={conditionColumn} onValueChange={setConditionColumn}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择列" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockColumns.map(column => (
                        <SelectItem key={column} value={column}>{column}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 文件命名 */}
            <Card className="hover:shadow-card transition-shadow duration-300">
              <CardHeader>
                <CardTitle>文件命名</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label className="text-sm font-medium">选择命名列</Label>
                  <Select value={namingColumn} onValueChange={setNamingColumn}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择用于命名的列" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockColumns.map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧预览 */}
          <div className="space-y-6">
            <Card className="hover:shadow-card transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>预览结果</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg max-h-60 overflow-y-auto">
                    <div className="space-y-2">
                      {getPreviewFileList().map((fileName, index) => (
                        <div key={index} className="text-sm text-foreground">
                          • {fileName}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          上一步
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={selectedSheets.length === 0 || !conditionColumn}
          className="px-8"
        >
          开始拆分
        </Button>
      </div>
    </div>
  );
};

export default SplitConfig;