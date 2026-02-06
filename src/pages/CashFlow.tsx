import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Wallet, 
  Plus, 
  Minus, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

const CATEGORIES = {
  income: ["Mesada", "Presente", "Trabalho", "Freelance", "Outros"],
  expense: ["Alimentação", "Transporte", "Lazer", "Educação", "Roupa", "Outros"]
};

const CashFlow = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<"income" | "expense">("income");
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
  });

  const totalIncome = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const handleAddTransaction = () => {
    if (!formData.amount || !formData.category) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type: formType,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: new Date().toISOString().split("T")[0],
    };

    setTransactions([newTransaction, ...transactions]);
    setFormData({ amount: "", category: "", description: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-display font-bold mb-2">Fluxo de Caixa</h1>
        <p className="text-muted-foreground">Controla as tuas receitas e despesas</p>
      </motion.div>

      {/* Balance card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-primary/20 via-card to-accent/10 border border-border rounded-2xl p-6"
      >
        <p className="text-sm text-muted-foreground mb-1">Saldo Atual</p>
        <p className={cn(
          "text-4xl font-display font-bold",
          balance >= 0 ? "text-success" : "text-destructive"
        )}>
          {balance >= 0 ? "+" : ""}{balance.toFixed(2)}€
        </p>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-card/60 backdrop-blur rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Entradas</span>
            </div>
            <p className="text-xl font-bold text-success">+{totalIncome.toFixed(2)}€</p>
          </div>
          <div className="bg-card/60 backdrop-blur rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
                <ArrowDownRight className="w-4 h-4 text-destructive" />
              </div>
              <span className="text-sm text-muted-foreground">Saídas</span>
            </div>
            <p className="text-xl font-bold text-destructive">-{totalExpense.toFixed(2)}€</p>
          </div>
        </div>
      </motion.div>

      {/* Add transaction buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3"
      >
        <Button
          variant="outline"
          size="lg"
          className="border-success text-success hover:bg-success/10"
          onClick={() => {
            setFormType("income");
            setShowForm(true);
          }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Receita
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="border-destructive text-destructive hover:bg-destructive/10"
          onClick={() => {
            setFormType("expense");
            setShowForm(true);
          }}
        >
          <Minus className="w-5 h-5 mr-2" />
          Despesa
        </Button>
      </motion.div>

      {/* Add form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-card border border-border rounded-xl p-4 space-y-4"
        >
          <h3 className="font-semibold flex items-center gap-2">
            {formType === "income" ? (
              <>
                <TrendingUp className="w-5 h-5 text-success" />
                Nova Receita
              </>
            ) : (
              <>
                <TrendingDown className="w-5 h-5 text-destructive" />
                Nova Despesa
              </>
            )}
          </h3>

          <div className="grid gap-3">
            <Input
              type="number"
              placeholder="Valor (€)"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="flex h-11 w-full rounded-lg border-2 border-border bg-card px-4 py-2 text-base"
            >
              <option value="">Selecionar categoria</option>
              {CATEGORIES[formType].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Input
              placeholder="Descrição (opcional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button 
              variant={formType === "income" ? "success" : "destructive"}
              className="flex-1"
              onClick={handleAddTransaction}
            >
              Adicionar
            </Button>
          </div>
        </motion.div>
      )}

      {/* Transactions list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Histórico
        </h2>

        <div className="space-y-3">
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl"
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                transaction.type === "income" ? "bg-success/20" : "bg-destructive/20"
              )}>
                {transaction.type === "income" ? (
                  <TrendingUp className="w-5 h-5 text-success" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-destructive" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {transaction.description || transaction.category}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.category} • {transaction.date}
                </p>
              </div>
              <p className={cn(
                "font-semibold",
                transaction.type === "income" ? "text-success" : "text-destructive"
              )}>
                {transaction.type === "income" ? "+" : "-"}{transaction.amount.toFixed(2)}€
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CashFlow;
