import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import React from "react";
import { Input } from "@/components/ui/input";
import { fetchModels } from "@/lib/modelApi";

interface Model {
  id: number;
  model_name: string;
  status?: string;
}

interface ModelsSectionProps {
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
  modelLoading,
  modelListLoading,
  modelPage,
  modelTotalPages,
  setModelPage,
  setEditingModel,
  setModelModalOpen,
  handleEditModel,
  handleDeleteModel,
}) => {
  const [models, setModels] = React.useState<any[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const searchTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const fetchAndSetModels = async (search?: string) => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      if (!token) throw new Error("No token found");
      const data = await fetchModels(1, 10, token, search ?? searchTerm);
      setModels(data.models || []);
    } catch (err) {
      setModels([]);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchAndSetModels();
  }, []);

  React.useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchAndSetModels(searchTerm);
    }, 400);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchTerm]);

  return (
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
        <div className="flex items-center mt-2 mb-2 gap-2">
          <Input
            type="text"
            placeholder="Search models..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full max-w-xs border border-red-200 focus:ring-2 focus:ring-red-200 rounded-lg shadow-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="flex flex-col items-center">
              <div className="mb-2 text-red-200 text-sm">Loading models...</div>
              <div className="w-12 h-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 border-opacity-30"></div>
              </div>
            </div>
          </div>
        )}
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
              {loading ? (
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
};

export default ModelsSection; 