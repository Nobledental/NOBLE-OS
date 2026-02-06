'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Package,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownLeft,
    Plus,
    History,
    Search,
    TrendingUp,
    ShieldAlert
} from 'lucide-react';
import { smartStockService, Consumable, StockMovement, LowStockAlert } from '@/lib/smart-stock';
import { MOCK_INVENTORY } from '@/lib/inventory-mock';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function InventoryHub() {
    const [searchTerm, setSearchTerm] = useState('');
    const [inventoryStatus, setInventoryStatus] = useState(smartStockService.getInventoryStatus());
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [alerts, setAlerts] = useState<LowStockAlert[]>(smartStockService.getPendingAlerts());

    // Initialize with mock data on first load
    useEffect(() => {
        if (smartStockService.getInventoryStatus().length === 0) {
            smartStockService.initializeInventory(MOCK_INVENTORY);
            refreshData();
        }
    }, []);

    const refreshData = () => {
        setInventoryStatus(smartStockService.getInventoryStatus());
        setAlerts(smartStockService.getPendingAlerts());
        // For demonstration, we show movements for the last 30 days
        const start = new Date();
        start.setDate(start.getDate() - 30);
        setMovements(smartStockService.getMovements(start, new Date(), 'demo-clinic'));
    };

    const handleAcknowledgeAlert = (alertId: string) => {
        smartStockService.acknowledgeAlert(alertId, 'Dr. Dhivakaran');
        refreshData();
        toast.success('Alert acknowledged');
    };

    const filteredInventory = inventoryStatus.filter(item =>
        item.consumable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.consumable.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-ios-reveal">
            {/* Header / Stats Overlay */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white p-6 relative overflow-hidden group">
                    <div className="relative z-10">
                        <Package className="w-8 h-8 text-indigo-400 mb-4" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Items</h4>
                        <div className="text-4xl font-black mt-1">{inventoryStatus.length}</div>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-6">
                    <AlertTriangle className="w-8 h-8 text-amber-500 mb-4" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Low Stock</h4>
                    <div className="text-4xl font-black mt-1 text-amber-600">
                        {inventoryStatus.filter(i => i.stockStatus === 'LOW').length}
                    </div>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-6">
                    <ShieldAlert className="w-8 h-8 text-rose-500 mb-4" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Critical / Out</h4>
                    <div className="text-4xl font-black mt-1 text-rose-600">
                        {inventoryStatus.filter(i => i.stockStatus === 'CRITICAL' || i.stockStatus === 'OUT').length}
                    </div>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-xl bg-indigo-600 text-white p-6">
                    <TrendingUp className="w-8 h-8 text-indigo-200 mb-4" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Usage Index</h4>
                    <div className="text-4xl font-black mt-1">H-92</div>
                </Card>
            </div>

            {/* Main Tabs Hub */}
            <Tabs defaultValue="inventory" className="w-full">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                    <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl h-14 border border-slate-200/50">
                        <TabsTrigger value="inventory" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest gap-2 data-[state=active]:bg-white data-[state=active]:shadow-xl h-10 transition-all">
                            <Box className="w-4 h-4" /> Stock Deck
                        </TabsTrigger>
                        <TabsTrigger value="movements" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest gap-2 data-[state=active]:bg-white data-[state=active]:shadow-xl h-10 transition-all">
                            <History className="w-4 h-4" /> Log Journal
                        </TabsTrigger>
                        <TabsTrigger value="alerts" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest gap-2 data-[state=active]:bg-white data-[state=active]:shadow-xl h-10 transition-all">
                            <div className="relative">
                                <AlertTriangle className="w-4 h-4" />
                                {alerts.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />}
                            </div>
                            Risk Alerts
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search SKU or Name..."
                                className="pl-11 h-14 rounded-2xl bg-white border-slate-200 focus:ring-4 focus:ring-indigo-100 font-bold text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button className="h-14 px-8 rounded-2xl bg-slate-900 border-none shadow-xl shadow-slate-200 hover:bg-black gap-3 group transition-all">
                            <Plus className="w-5 h-5 text-indigo-400 group-hover:rotate-90 transition-transform duration-500" />
                            <span className="font-black text-[10px] uppercase tracking-widest text-white">Add Consumable</span>
                        </Button>
                    </div>
                </div>

                {/* Stock Deck Content */}
                <TabsContent value="inventory" className="mt-0 outline-none">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredInventory.map(({ consumable, stockStatus }) => (
                            <Card key={consumable.id} className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all group">
                                <div className="p-8">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="space-y-1">
                                            <Badge className={cn(
                                                "rounded-lg font-black text-[8px] uppercase tracking-[0.2em] px-3 py-1 border-none",
                                                consumable.category === 'MATERIAL' ? "bg-blue-50 text-blue-600" :
                                                    consumable.category === 'MEDICATION' ? "bg-purple-50 text-purple-600" :
                                                        "bg-slate-50 text-slate-600"
                                            )}>
                                                {consumable.category}
                                            </Badge>
                                            <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{consumable.name}</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SKU: {consumable.sku}</p>
                                        </div>
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse-slow",
                                            stockStatus === 'OK' ? "bg-emerald-50 text-emerald-600" :
                                                stockStatus === 'LOW' ? "bg-amber-50 text-amber-600" :
                                                    "bg-rose-50 text-rose-600"
                                        )}>
                                            <Package className="w-6 h-6" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-end justify-between">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Level</span>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-3xl font-black text-slate-900">{consumable.currentStock}</span>
                                                    <span className="text-xs font-bold text-slate-500">{consumable.unit}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reorder Set</span>
                                                <div className="text-sm font-bold text-slate-900">{consumable.reorderPoint} {consumable.unit}</div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-1000",
                                                    stockStatus === 'OK' ? "bg-emerald-500" :
                                                        stockStatus === 'LOW' ? "bg-amber-500" :
                                                            "bg-rose-500"
                                                )}
                                                style={{ width: `${Math.min(100, (consumable.currentStock / (consumable.reorderPoint * 2)) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 border-t border-slate-100 px-8 py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {consumable.supplier || 'No Supplier'}
                                        </span>
                                    </div>
                                    <Button variant="ghost" className="h-10 rounded-xl font-black text-[10px] uppercase tracking-widest text-indigo-600 hover:bg-white hover:text-indigo-700 gap-2">
                                        <ArrowUpRight className="w-3 h-3" /> Quick Restock
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Movements Log Content */}
                <TabsContent value="movements" className="mt-0 outline-none">
                    <Card className="rounded-[3rem] border-slate-100 shadow-xl overflow-hidden">
                        <div className="bg-slate-900 p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-white font-black text-lg tracking-tight">Stock Movements Log</h3>
                                    <p className="text-slate-400 text-sm font-medium">Auto-synced from treatments and manual audits</p>
                                </div>
                                <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 h-12 font-bold uppercase tracking-widest text-[10px]">
                                    Export Journal (CSV)
                                </Button>
                            </div>
                        </div>
                        <div className="p-0">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Item</th>
                                        <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                        <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty</th>
                                        <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason</th>
                                        <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Performed At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movements.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <History className="w-12 h-12 text-slate-200" />
                                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No movements recorded yet</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        movements.sort((a, b) => b.performedAt.getTime() - a.performedAt.getTime()).map(m => (
                                            <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="font-bold text-slate-900">{m.consumableName}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Ref: {m.referenceId || 'N/A'}</div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    {m.movementType === 'IN' ? (
                                                        <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-lg text-[10px] font-black tracking-widest px-3 py-1">IN</Badge>
                                                    ) : (
                                                        <Badge className="bg-rose-50 text-rose-600 border-none rounded-lg text-[10px] font-black tracking-widest px-3 py-1">OUT</Badge>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 font-black text-slate-900">{m.quantity}</td>
                                                <td className="px-8 py-6 text-sm text-slate-600 font-medium">{m.reason}</td>
                                                <td className="px-8 py-6 text-xs text-slate-400 font-bold">
                                                    {m.performedAt.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </TabsContent>

                {/* Risk Alerts Content */}
                <TabsContent value="alerts" className="mt-0 outline-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {alerts.length === 0 ? (
                            <Card className="col-span-full rounded-[3rem] border-dashed border-2 border-slate-200 p-20 flex flex-col items-center gap-4">
                                <ShieldAlert className="w-16 h-16 text-slate-100" />
                                <h3 className="text-slate-400 font-black text-lg tracking-widest uppercase">Inventory Secure</h3>
                                <p className="text-slate-300 text-sm font-bold">No active stock risks identified</p>
                            </Card>
                        ) : (
                            alerts.map(alert => (
                                <Card key={alert.id} className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden group">
                                    <div className="p-8 flex gap-6">
                                        <div className={cn(
                                            "w-20 h-20 rounded-3xl flex flex-col items-center justify-center shrink-0",
                                            alert.priority === 'CRITICAL' ? "bg-rose-600 text-white" : "bg-amber-100 text-amber-600"
                                        )}>
                                            <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Level</span>
                                            <span className="text-2xl font-black leading-none">{alert.currentStock}</span>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Badge className={cn(
                                                    "rounded-lg font-black text-[8px] uppercase tracking-[0.2em] px-3 py-1 border-none",
                                                    alert.priority === 'CRITICAL' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                                                )}>
                                                    {alert.priority} RISK
                                                </Badge>
                                                <span className="text-[10px] font-bold text-slate-400">Raised: {alert.createdAt.toLocaleTimeString()}</span>
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 leading-tight">{alert.consumableName}</h3>
                                            <p className="text-xs text-slate-500 font-medium">
                                                Stock has fallen below reorder point ({alert.reorderPoint}). Immediate replenishment required.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                        <Button variant="ghost" className="rounded-xl px-4 h-10 font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-white transition-all">
                                            Dismiss Notice
                                        </Button>
                                        <Button
                                            onClick={() => handleAcknowledgeAlert(alert.id)}
                                            className="rounded-xl px-6 h-10 bg-slate-900 border-none shadow-lg text-white font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all"
                                        >
                                            Generate PI / Restock
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function Box(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
        </svg>
    )
}
