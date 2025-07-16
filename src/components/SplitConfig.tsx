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
}

interface SplitConfigProps {
  file: UploadedFile;
  onConfigSubmit: (config: SplitConfigType) => void;
  onBack: () => void;
}

const SplitConfig = ({ file, onConfigSubmit, onBack }: SplitConfigProps) => {
  const [selectedSheets, setSelectedSheets] = useState<string[]>([file.sheets[0]]);
  const [splitType, setSplitType] = useState<"rows" | "columns" | "condition">("rows");
  const [rowsPerFile, setRowsPerFile] = useState(1000);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [conditionColumn, setConditionColumn] = useState("");
  const [namingRule, setNamingRule] = useState("sequential");
  const [namingColumn, setNamingColumn] = useState("");
  
  // 模拟列数据
  const mockColumns = ["A", "B", "C", "D", "E", "姓名", "部门", "职位", "薪资", "入职日期"];

  const handleSheetToggle = (sheetName: string) => {
    setSelectedSheets(prev => 
      prev.includes(sheetName) 
        ? prev.filter(s => s !== sheetName)
        : [...prev, sheetName]
    );
  };

  const handleColumnToggle = (column: string) => {
    setSelectedColumns(prev => 
      prev.includes(column) 
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  const getPreviewInfo = () => {
    if (selectedSheets.length === 0) return "请选择至少一个工作表";
    
    let filesCount = 0;
    selectedSheets.forEach(sheet => {
      if (splitType === "rows") {
        // 假设每个工作表有5000行数据
        const totalRows = 5000;
        filesCount += Math.ceil(totalRows / rowsPerFile);
      } else if (splitType === "columns" && selectedColumns.length > 0) {
        filesCount += 1; // 每个工作表一个文件
      } else if (splitType === "condition" && conditionColumn) {
        // 假设有3个不同的条件值
        filesCount += 3;
      }
    });
    
    return `预计生成 ${filesCount} 个文件`;
  };

  const handleSubmit = () => {
    if (selectedSheets.length === 0) return;
    
    const config: SplitConfigType = {
      selectedSheets,
      splitType,
      rowsPerFile: splitType === "rows" ? rowsPerFile : undefined,
      selectedColumns: splitType === "columns" ? selectedColumns : undefined,
      conditionColumn: splitType === "condition" ? conditionColumn : undefined,
      namingRule,
      namingColumn: namingColumn || undefined,
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧配置 */}
        <div className="space-y-6">
          {/* 选择工作表 */}
          <Card>
            <CardHeader>
              <CardTitle>选择工作表</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {file.sheets.map(sheet => (
                <div key={sheet} className="flex items-center space-x-2">
                  <Checkbox 
                    id={sheet}
                    checked={selectedSheets.includes(sheet)}
                    onCheckedChange={() => handleSheetToggle(sheet)}
                  />
                  <Label htmlFor={sheet} className="cursor-pointer">{sheet}</Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 拆分方式 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>拆分方式</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={splitType} onValueChange={(value: any) => setSplitType(value)}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rows" id="rows" />
                    <Label htmlFor="rows" className="cursor-pointer">按行数拆分</Label>
                  </div>
                  {splitType === "rows" && (
                    <div className="ml-6">
                      <Label htmlFor="rowsPerFile" className="text-sm">每个文件包含行数</Label>
                      <Input
                        id="rowsPerFile"
                        type="number"
                        value={rowsPerFile}
                        onChange={(e) => setRowsPerFile(Number(e.target.value))}
                        min={1}
                        max={100000}
                        className="mt-1"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="columns" id="columns" />
                    <Label htmlFor="columns" className="cursor-pointer">按列拆分</Label>
                  </div>
                  {splitType === "columns" && (
                    <div className="ml-6 space-y-2">
                      <Label className="text-sm">选择要保留的列</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {mockColumns.map(column => (
                          <div key={column} className="flex items-center space-x-1">
                            <Checkbox 
                              id={column}
                              checked={selectedColumns.includes(column)}
                              onCheckedChange={() => handleColumnToggle(column)}
                            />
                            <Label htmlFor={column} className="text-xs cursor-pointer">{column}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="condition" id="condition" />
                    <Label htmlFor="condition" className="cursor-pointer">按条件拆分</Label>
                  </div>
                  {splitType === "condition" && (
                    <div className="ml-6">
                      <Label htmlFor="conditionColumn" className="text-sm">根据列的值分组</Label>
                      <Select value={conditionColumn} onValueChange={setConditionColumn}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="选择列" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockColumns.map(column => (
                            <SelectItem key={column} value={column}>{column}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* 右侧预览和命名 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>文件命名</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <RadioGroup value={namingRule} onValueChange={setNamingRule}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sequential" id="sequential" />
                    <Label htmlFor="sequential" className="text-sm">按序号命名</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="timestamp" id="timestamp" />
                    <Label htmlFor="timestamp" className="text-sm">按时间戳命名</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="original" id="original" />
                    <Label htmlFor="original" className="text-sm">基于原文件名</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="column" id="column" />
                    <Label htmlFor="column" className="text-sm">基于列值命名</Label>
                  </div>
                </RadioGroup>
                
                {namingRule === "column" && (
                  <div className="mt-4">
                    <Label htmlFor="namingColumn" className="text-sm font-medium">选择命名列</Label>
                    <Select value={namingColumn} onValueChange={setNamingColumn}>
                      <SelectTrigger className="w-full mt-2">
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
                )}
              </div>
            </CardContent>
          </Card>

          {/* 预览结果 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>预览结果</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium text-foreground">
                    {getPreviewInfo()}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">示例文件名：</Label>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="p-2 bg-muted/50 rounded">
                      数据表_Sheet1_001.xlsx
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      数据表_Sheet1_002.xlsx
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      数据表_数据表_001.xlsx
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          上一步
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={selectedSheets.length === 0}
          className="px-8"
        >
          开始拆分
        </Button>
      </div>
    </div>
  );
};

export default SplitConfig;