"use client";

import { useState } from "react";
import { Plus, Edit2, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  isAvailable: boolean;
  spiceLevel: number;
  dietaryTags: string[];
}

const DEMO_MENU: MenuItem[] = [
  {
    id: "1",
    name: "Butter Chicken",
    description: "Creamy tomato-based curry with tender chicken",
    category: "main",
    price: 16.99,
    isAvailable: true,
    spiceLevel: 2,
    dietaryTags: [],
  },
  {
    id: "2",
    name: "Paneer Tikka",
    description: "Grilled cottage cheese with spices",
    category: "appetizer",
    price: 12.99,
    isAvailable: true,
    spiceLevel: 3,
    dietaryTags: ["veg"],
  },
  {
    id: "3",
    name: "Garlic Naan",
    description: "Freshly baked bread with garlic",
    category: "bread",
    price: 3.99,
    isAvailable: false,
    spiceLevel: 0,
    dietaryTags: ["veg"],
  },
  {
    id: "4",
    name: "Gulab Jamun",
    description: "Sweet milk dumplings in rose syrup",
    category: "dessert",
    price: 6.99,
    isAvailable: true,
    spiceLevel: 0,
    dietaryTags: ["veg"],
  },
];

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEMO_MENU);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "main",
    price: "",
    spiceLevel: "0",
  });

  const toggleAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const openAddDialog = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      category: "main",
      price: "",
      spiceLevel: "0",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price.toString(),
      spiceLevel: item.spiceLevel.toString(),
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) return;

    if (editingItem) {
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: formData.name,
                description: formData.description,
                category: formData.category,
                price: parseFloat(formData.price),
                spiceLevel: parseInt(formData.spiceLevel),
              }
            : item
        )
      );
    } else {
      setMenuItems((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: formData.name,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          isAvailable: true,
          spiceLevel: parseInt(formData.spiceLevel),
          dietaryTags: [],
        },
      ]);
    }
    setDialogOpen(false);
  };

  const groupedItems = menuItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">
            Add, edit, and manage your menu items
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-orange-600 hover:bg-orange-700"
              onClick={openAddDialog}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Menu Item" : "Add Menu Item"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Dish name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) =>
                      setFormData((f) => ({ ...f, category: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appetizer">Appetizer</SelectItem>
                      <SelectItem value="main">Main Course</SelectItem>
                      <SelectItem value="bread">Bread</SelectItem>
                      <SelectItem value="rice">Rice</SelectItem>
                      <SelectItem value="dessert">Dessert</SelectItem>
                      <SelectItem value="beverage">Beverage</SelectItem>
                      <SelectItem value="side">Side</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, price: e.target.value }))
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="spice">Spice Level (0-5)</Label>
                <Input
                  id="spice"
                  type="number"
                  min="0"
                  max="5"
                  value={formData.spiceLevel}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      spiceLevel: e.target.value,
                    }))
                  }
                />
              </div>
              <Button className="w-full" onClick={handleSave}>
                {editingItem ? "Update Item" : "Add Item"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-lg font-semibold capitalize mb-4">
              {category}
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className={!item.isAvailable ? "opacity-60" : ""}
                >
                  <CardContent className="py-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        {item.dietaryTags.includes("veg") && (
                          <Badge
                            variant="outline"
                            className="text-green-600 text-xs"
                          >
                            Veg
                          </Badge>
                        )}
                        {!item.isAvailable && (
                          <Badge variant="secondary" className="text-xs">
                            Unavailable
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        ${item.price.toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleAvailability(item.id)}
                        title={
                          item.isAvailable
                            ? "Mark unavailable"
                            : "Mark available"
                        }
                      >
                        {item.isAvailable ? (
                          <ToggleRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(item)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
