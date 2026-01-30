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
    FileText
} from "lucide-react"

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
}

export function CommandPalette() {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const router = useRouter()

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
        queryKey: ['globalSearch', query],
        queryFn: async () => {
            if (query.length < 2) return [];
            const res = await api.get<PatientResult[]>(`/patients/search?q=${query}`);
            return res.data;
        },
        enabled: query.length >= 2,
    })

    const onSelectPatient = (id: string) => {
        setOpen(false)
        router.push(`/patients/${id}`)
    }

    return (
        <>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Search patients by name, ID or mobile..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    {searchResults && searchResults.length > 0 && (
                        <CommandGroup heading="Patients">
                            {searchResults.map((patient) => (
                                <CommandItem
                                    key={patient.id}
                                    onSelect={() => onSelectPatient(patient.id)}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>{patient.name}</span>
                                        <span className="ml-2 text-[10px] text-muted-foreground">({patient.healthFloId})</span>
                                    </div>
                                    <span className="text-xs font-mono text-muted-foreground">{patient.phone}</span>
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
