"use client"

import * as React from "react"
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    UserPlus,
    FileText,
    Loader2,
    CheckCircle2,
    AlertCircle
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

interface PatientResult {
    id: string;
    name: string;
    phone: string;
    healthFloId: string;
    maskedAadhaar: string;
}

export function CommandPalette() {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [debouncedQuery, setDebouncedQuery] = React.useState("")
    const router = useRouter()

    // ⏲️ 300ms Debounce (Master Blueprint requirement)
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query)
        }, 300)
        return () => clearTimeout(timer)
    }, [query])

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const { data: searchResults, isLoading } = useQuery({
        queryKey: ['globalSearch', debouncedQuery],
        queryFn: async () => {
            if (debouncedQuery.length < 2) return [];
            const res = await api.get<PatientResult[]>(`/patients/search?q=${debouncedQuery}`);
            return res.data;
        },
        enabled: debouncedQuery.length >= 2,
    })

    const onSelectPatient = (id: string) => {
        setOpen(false)
        router.push(`/patients/${id}`)
    }

    const onCheckIn = async (patientId: string, isEmergency = false) => {
        try {
            await api.post('/appointments/check-in', {
                patientId,
                clinicId: 'noble-dental-primary', // Hardcoded for Noble Dental
                isEmergency
            });
            toast.success(isEmergency ? "Emergency Check-in Priority #1" : "Patient Checked In successfully");
            setOpen(false);
        } catch (error) {
            toast.error("Check-in failed. Please try again.");
        }
    }

    return (
        <>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <div className="relative">
                    <CommandInput
                        placeholder="Search patients by name, ID or mobile..."
                        value={query}
                        onValueChange={setQuery}
                        className="h-14"
                    />
                    {isLoading && (
                        <div className="absolute right-4 top-4">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                    )}
                </div>
                <CommandList className="max-h-[450px]">
                    <CommandEmpty>
                        {query.length < 2 ? "Type at least 2 characters..." : "No results found."}
                    </CommandEmpty>

                    {searchResults && searchResults.length > 0 && (
                        <CommandGroup heading="Patients">
                            {searchResults.map((patient) => (
                                <CommandItem
                                    key={patient.id}
                                    onSelect={() => onSelectPatient(patient.id)}
                                    className="flex items-center justify-between p-3"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="h-9 w-9 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                                            <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <div className="flex items-center">
                                                <span className="font-semibold text-sm">{patient.name}</span>
                                                <Badge variant="outline" className="ml-2 text-[9px] font-mono border-indigo-100 bg-indigo-50/30 text-indigo-700">
                                                    {patient.healthFloId}
                                                </Badge>
                                            </div>
                                            <div className="text-[10px] text-muted-foreground flex items-center space-x-2 mt-0.5">
                                                <span>{patient.maskedAadhaar}</span>
                                                <span>•</span>
                                                <span>{patient.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onCheckIn(patient.id) }}
                                            className="p-1.5 hover:bg-green-100 rounded-full text-green-600 transition-colors"
                                            title="Normal Check-in"
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onCheckIn(patient.id, true) }}
                                            className="p-1.5 hover:bg-red-100 rounded-full text-red-600 transition-colors"
                                            title="Emergency Check-in"
                                        >
                                            <AlertCircle className="h-4 w-4" />
                                        </button>
                                        <CommandShortcut>↵</CommandShortcut>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    <CommandGroup heading="Quick Actions">
                        <CommandItem onSelect={() => { setOpen(false); router.push('/patients/new') }}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            <span>Register New Patient</span>
                        </CommandItem>
                        <CommandItem>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Create Instant Bill</span>
                        </CommandItem>
                        <CommandItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Book Appointment</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Navigation">
                        <CommandItem onSelect={() => { setOpen(false); router.push('/patients') }}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Patient Directory</span>
                            <CommandShortcut>⌘P</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => { setOpen(false); router.push('/billing') }}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Billing & Revenue</span>
                            <CommandShortcut>⌘B</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => { setOpen(false); router.push('/settings') }}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Clinic Settings</span>
                            <CommandShortcut>⌘S</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
