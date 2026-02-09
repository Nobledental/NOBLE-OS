"use client";

import { useState, useEffect } from "react";
import { Search, Clock, Plus, Minus, ShoppingBag, Zap, TrendingUp, AlertCircle } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Zepto-style Vibrant Palette
const THEME = {
    primary: "bg-[#3600D1]", // Deep Zepto Purple/Blue
    accent: "bg-[#FF3269]",  // Hot Pink/Red for offers
    success: "bg-[#00B259]", // Fresh Green
    warning: "bg-[#FF9400]", // Urgent Orange
};

const CATEGORIES = [
    { name: "Instant Restock", icon: "⚡", color: "bg-purple-100 text-purple-700" },
    { name: "Dental Consumables", icon: "🦷", color: "bg-blue-100 text-blue-700" },
    { name: "Surgical Basics", icon: "💉", color: "bg-green-100 text-green-700" },
    { name: "Sterilization", icon: "🧼", color: "bg-orange-100 text-orange-700" },
    { name: "Front Desk", icon: "📝", color: "bg-pink-100 text-pink-700" },
];

const INVENTORY_ITEMS = [
    { id: 1, name: "Lignox 2% A", brand: "Indoco", price: 450, stock: 12, unit: "Vial", image: "💉", eta: "8 mins" },
    { id: 2, name: "Septodont Septanest", brand: "Septodont", price: 2200, stock: 4, unit: "Box (50)", image: "🧊", eta: "12 mins", lowStock: true },
    { id: 3, name: "Disposable Gloves (M)", brand: "SafeTouch", price: 350, stock: 100, unit: "Box (100)", image: "🧤", eta: "9 mins" },
    { id: 4, name: "Cotton Rolls #2", brand: "Prime", price: 120, stock: 8, unit: "Pack", image: "☁️", eta: "10 mins" },
    { id: 5, name: "Suction Tips", brand: "Euronda", price: 180, stock: 2, unit: "Packet", image: "🥤", eta: "15 mins", critical: true },
    { id: 6, name: "Face Masks 3-Ply", brand: "Magnum", price: 200, stock: 50, unit: "Box", image: "😷", eta: "7 mins" },
    { id: 7, name: "Bonding Agent", brand: "3M", price: 1800, stock: 1, unit: "Bottle", image: "🧴", eta: "11 mins", critical: true },
    { id: 8, name: "Composite Kit", brand: "Dentsply", price: 4500, stock: 3, unit: "Kit", image: "🦷", eta: "14 mins" },
];

export function InstaStore() {
    const [cart, setCart] = useState<{ [key: number]: number }>({});
    const [isCartOpen, setIsCartOpen] = useState(false);

    const cartTotal = Object.entries(cart).reduce((total, [id, qty]) => {
        const item = INVENTORY_ITEMS.find(i => i.id === Number(id));
        return total + (item ? item.price * qty : 0);
    }, 0);

    const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

    const updateCart = (id: number, delta: number) => {
        setCart(prev => {
            const current = prev[id] || 0;
            const newQty = Math.max(0, current + delta);
            if (newQty === 0) {
                const { [id]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [id]: newQty };
        });
        if (delta > 0) toast.success("Added to Quick Order");
    };

    return (
        <div className="bg-[#F5F7FA] min-h-screen pb-32 font-sans relative overflow-hidden">
            {/* Mesh Gradient Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#3600D1]/10 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-indigo-50 px-4 py-3 flex items-center justify-between shadow-sm">
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        NOBLE<span className="text-[#3600D1]">INSTA</span>
                        <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
                    </h1>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Clinic Inventory</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs font-bold text-slate-700">Delivering to</span>
                        <span className="text-xs font-bold text-[#3600D1] flex items-center gap-1">
                            Operatory 1 <Clock className="w-3 h-3" /> 8 mins
                        </span>
                    </div>
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <Search className="w-5 h-5 text-slate-500" />
                    </div>
                </div>
            </div>

            {/* Hero / Banner */}
            <div className="p-4">
                <div className="w-full h-40 bg-gradient-to-r from-[#3600D1] to-[#6020F0] rounded-2xl relative overflow-hidden shadow-xl flex items-center p-6 text-white">
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 max-w-[60%]">
                        <Badge className="bg-[#FF3269] hover:bg-[#FF3269] text-white border-0 mb-2 animate-bounce">CRITICAL RESTOCK</Badge>
                        <h2 className="text-2xl font-black">Running Low on LA?</h2>
                        <p className="text-sm opacity-90 mt-1">Lignox 2% is at 10% stock. Order now for 10-min delivery.</p>
                    </div>
                    <div className="absolute right-4 bottom-0 text-[80px]">💉</div>
                </div>
            </div>

            {/* Categories */}
            <div className="px-4 mb-6">
                <div className="flex justify-between items-end mb-3">
                    <h3 className="font-bold text-slate-800">Shop by Category</h3>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                    {CATEGORIES.map((cat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex flex-col items-center gap-2 cursor-pointer"
                        >
                            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-transparent hover:border-indigo-200 transition-colors bg-white", cat.color)}>
                                {cat.icon}
                            </div>
                            <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">{cat.name}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Inventory Grid */}
            <div className="px-4">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    Start Restocking <TrendingUp className="w-4 h-4 text-green-500" />
                </h3>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {INVENTORY_ITEMS.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm relative group hover:shadow-md transition-shadow">

                            {/* Tags */}
                            <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                                <div className="bg-slate-50/90 backdrop-blur text-[10px] font-bold px-2 py-0.5 rounded border border-slate-100 flex items-center gap-1 shadow-sm">
                                    <Clock className="w-3 h-3 text-green-600" /> {item.eta}
                                </div>
                                {item.critical && (
                                    <div className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100 flex items-center gap-1 animate-pulse">
                                        Critically Low
                                    </div>
                                )}
                            </div>

                            {/* Image Area */}
                            <div className="h-32 bg-slate-50 rounded-lg mb-3 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300">
                                {item.image}
                            </div>

                            {/* Details */}
                            <div className="space-y-1">
                                <h4 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">{item.name}</h4>
                                <p className="text-xs text-slate-400">{item.unit} • {item.brand}</p>
                            </div>

                            {/* Price & Action */}
                            <div className="mt-3 flex items-center justify-between">
                                <div>
                                    <span className="block text-[10px] text-slate-400 line-through">₹{Math.round(item.price * 1.2)}</span>
                                    <span className="font-black text-slate-900">₹{item.price}</span>
                                </div>

                                {/* Add Button Logic */}
                                {cart[item.id] ? (
                                    <div className="flex items-center gap-2 bg-[#3600D1] text-white rounded-lg px-2 py-1 shadow-lg shadow-indigo-200">
                                        <button onClick={() => updateCart(item.id, -1)} className="p-0.5 hover:bg-white/20 rounded"><Minus className="w-3 h-3" /></button>
                                        <span className="text-xs font-bold w-3 text-center">{cart[item.id]}</span>
                                        <button onClick={() => updateCart(item.id, 1)} className="p-0.5 hover:bg-white/20 rounded"><Plus className="w-3 h-3" /></button>
                                    </div>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 border-[#3600D1] text-[#3600D1] hover:bg-[#3600D1] hover:text-white font-bold text-xs uppercase px-4 transition-all"
                                        onClick={() => updateCart(item.id, 1)}
                                    >
                                        ADD
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Cart (Zepto Style) */}
            <AnimatePresence>
                {cartCount > 0 && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-4 left-4 right-4 md:left-[280px] md:right-8 z-50"
                    >
                        <div className="bg-[#3600D1] text-white p-3 rounded-xl shadow-2xl shadow-indigo-300 flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-transform">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center font-bold">
                                    {cartCount}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs opacity-80 uppercase font-bold">Total Estimate</span>
                                    <span className="font-black text-lg">₹{cartTotal.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 font-bold text-sm pr-2">
                                Place Order <ShoppingBag className="w-4 h-4" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
