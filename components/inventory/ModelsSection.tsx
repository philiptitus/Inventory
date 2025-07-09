import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import React from "react";

interface Model {
  id: number;
  model_name: string;
  status?: string;
}

interface ModelsSectionProps {
  models: Model[];
  modelLoading: boolean;
  modelListLoading: boolean;
  modelPage: number;
  modelTotalPages: number;
  setModelPage: (page: number) => void;
  setEditingModel: (model: Model | undefined) => void;
  setModelModalOpen: (open: boolean) => void;
  handleEditModel: (model: Model) => void;
  handleDeleteModel: (model: Model) => void;
}

const ModelsSection: React.FC<ModelsSectionProps> = ({
  models,
  modelLoading,
  modelListLoading,
  modelPage,
  modelTotalPages,
  setModelPage,
  setEditingModel,
  setModelModalOpen,
  handleEditModel,
  handleDeleteModel,
}) => (
  <Card className="bg-white border border-[#d9d9d9]">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-[#1c1b1f] text-lg capitalize">models</CardTitle>
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          onClick={() => { setEditingModel(undefined); setModelModalOpen(true); }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Model
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#d9d9d9]">
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Model Name</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Status</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {modelListLoading ? (
              <tr><td colSpan={3} className="py-8 text-center text-red-300">Loading...</td></tr>
            ) : models.length === 0 ? (
              <tr><td colSpan={3} className="py-8 text-center text-red-300">No data found.</td></tr>
            ) : models.map((model) => (
              <tr key={model.id} className="border-b border-[#d9d9d9]">
                <td className="py-3 px-4 text-sm">{model.model_name}</td>
                <td className="py-3 px-4 text-sm">{model.status || ""}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditModel(model)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-[#be0606] hover:text-[#be0606]"
                      onClick={() => handleDeleteModel(model)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modelTotalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4">
          <Button size="sm" variant="outline" disabled={modelPage === 1} onClick={() => setModelPage(modelPage - 1)}>
            Previous
          </Button>
          <span className="text-sm">Page {modelPage} of {modelTotalPages}</span>
          <Button size="sm" variant="outline" disabled={modelPage === modelTotalPages} onClick={() => setModelPage(modelPage + 1)}>
            Next
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
);

export default ModelsSection; 