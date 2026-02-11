import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  Plus, 
  Minus,
  Search,
  ArrowUpDown,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface StockItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  lastUpdated: string;
}

interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: "in" | "out";
  quantity: number;
  date: string;
  note?: string;
}

const Stock = () => {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<"add" | "in" | "out">("add");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "",
    note: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    if (!formData.name || !formData.quantity || !formData.unit) return;

    const newItem: StockItem = {
      id: crypto.randomUUID(),
      name: formData.name,
      quantity: parseInt(formData.quantity),
      unit: formData.unit,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setItems([...items, newItem]);
    resetForm();
  };

  const handleStockMovement = () => {
    if (!selectedProduct || !formData.quantity) return;

    const product = items.find(i => i.id === selectedProduct);
    if (!product) return;

    const qty = parseInt(formData.quantity);
    
    // Update stock
    setItems(items.map(item => {
      if (item.id === selectedProduct) {
        return {
          ...item,
          quantity: formType === "in" ? item.quantity + qty : Math.max(0, item.quantity - qty),
          lastUpdated: new Date().toISOString().split("T")[0],
        };
      }
      return item;
    }));

    // Add movement
    const newMovement: StockMovement = {
      id: crypto.randomUUID(),
      productId: selectedProduct,
      productName: product.name,
      type: formType as "in" | "out",
      quantity: qty,
      date: new Date().toISOString().split("T")[0],
      note: formData.note,
    };

    setMovements([newMovement, ...movements]);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", quantity: "", unit: "", note: "" });
    setSelectedProduct("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-display font-bold mb-2">Gestão de Stock</h1>
        <p className="text-muted-foreground">Controla o inventário da família</p>
      </motion.div>

      {/* Search and actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Pesquisar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => { setFormType("add"); setShowForm(true); }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Produto
          </Button>
          <Button
            variant="gradient"
            onClick={() => { setFormType("in"); setShowForm(true); }}
          >
            <ArrowUpDown className="w-4 h-4 mr-2" />
            Movimento
          </Button>
        </div>
      </motion.div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-card border border-border rounded-xl p-4 space-y-4"
        >
          <h3 className="font-semibold">
            {formType === "add" ? "Novo Produto" : formType === "in" ? "Entrada de Stock" : "Saída de Stock"}
          </h3>

          {formType === "add" ? (
            <div className="grid gap-3">
              <Input
                placeholder="Nome do produto"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Quantidade"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
                <Input
                  placeholder="Unidade (kg, L, etc)"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="flex h-11 w-full rounded-lg border-2 border-border bg-card px-4 py-2"
              >
                <option value="">Selecionar produto</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.quantity} {item.unit})
                  </option>
                ))}
              </select>
              <div className="flex gap-3">
                <Button
                  variant={formType === "in" ? "default" : "outline"}
                  className={cn("flex-1", formType === "in" && "bg-success hover:bg-success/90")}
                  onClick={() => setFormType("in")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Entrada
                </Button>
                <Button
                  variant={formType === "out" ? "default" : "outline"}
                  className={cn("flex-1", formType === "out" && "bg-destructive hover:bg-destructive/90")}
                  onClick={() => setFormType("out")}
                >
                  <Minus className="w-4 h-4 mr-2" />
                  Saída
                </Button>
              </div>
              <Input
                type="number"
                placeholder="Quantidade"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
              <Input
                placeholder="Nota (opcional)"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={resetForm}>
              Cancelar
            </Button>
            <Button
              variant="gradient"
              className="flex-1"
              onClick={formType === "add" ? handleAddProduct : handleStockMovement}
            >
              {formType === "add" ? "Adicionar" : "Registar"}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Stock list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Inventário ({filteredItems.length})
        </h2>

        <div className="grid gap-3">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  Atualizado: {item.lastUpdated}
                </p>
              </div>
              <div className="text-right">
                <p className={cn(
                  "text-xl font-bold",
                  item.quantity <= 2 ? "text-destructive" : item.quantity <= 5 ? "text-warning" : "text-foreground"
                )}>
                  {item.quantity}
                </p>
                <p className="text-sm text-muted-foreground">{item.unit}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Movements history */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Histórico de Movimentos
        </h2>

        <div className="space-y-3">
          {movements.slice(0, 5).map((movement, index) => (
            <motion.div
              key={movement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl"
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                movement.type === "in" ? "bg-success/20" : "bg-destructive/20"
              )}>
                {movement.type === "in" ? (
                  <Plus className="w-5 h-5 text-success" />
                ) : (
                  <Minus className="w-5 h-5 text-destructive" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{movement.productName}</p>
                <p className="text-sm text-muted-foreground">
                  {movement.date} {movement.note && `• ${movement.note}`}
                </p>
              </div>
              <p className={cn(
                "font-semibold",
                movement.type === "in" ? "text-success" : "text-destructive"
              )}>
                {movement.type === "in" ? "+" : "-"}{movement.quantity}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Stock;
