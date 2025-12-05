"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox" // Need to install checkbox if not present, or use custom
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SPORTS, FREQUENCIES, LEVELS, GOALS, CONSTRAINTS, BUDGETS } from "@/types/profile"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
    sport: z.string().min(1, "Please select a sport"),
    frequency: z.string().min(1, "Please select frequency"),
    level: z.string().min(1, "Please select level"),
    goals: z.array(z.string()).min(1, "Select at least one goal"),
    constraints: z.array(z.string()),
    budget: z.string().min(1, "Please select budget"),
    medical_conditions: z.string().optional(),
    posture_rating: z.string().optional(), // Using string for select/radio, convert to int later if needed
    back_pain: z.string().optional(),
    sedentary_level: z.string().optional(),
})

export function QCMForm({ onSubmit }: { onSubmit: (data: z.infer<typeof formSchema>) => void }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sport: "",
            frequency: "",
            level: "",
            goals: [],
            constraints: [],
            budget: "",
            medical_conditions: "",
            posture_rating: "",
            back_pain: "",
            sedentary_level: "",
        },
    })

    return (
        <Card className="w-full max-w-2xl mx-auto border-2 border-primary/20 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
            <CardHeader className="text-center space-y-2">
                <CardTitle className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                    🚀 Ton Profil de Champion
                </CardTitle>
                <CardDescription className="text-lg">
                    Dis-nous tout (on ne le répétera pas à ton coach 🤫)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) => {
                        // Transform data for backend compatibility
                        const formattedData = {
                            ...data,
                            posture_rating: data.posture_rating ? parseInt(data.posture_rating) : undefined,
                            medical_conditions: data.medical_conditions || undefined,
                            back_pain: data.back_pain || undefined,
                            sedentary_level: data.sedentary_level || undefined
                        }
                        onSubmit(formattedData)
                    })} className="space-y-8">

                        {/* Sport */}
                        <FormField
                            control={form.control}
                            name="sport"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-semibold">🏆 Ton terrain de jeu ?</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-12 text-base">
                                                <SelectValue placeholder="Choisis ton poison..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {SPORTS.map((sport) => (
                                                <SelectItem key={sport} value={sport} className="text-base">
                                                    {sport === "Running" ? "🏃 Course à pied" :
                                                        sport === "Cycling" ? "🚴 Cyclisme" :
                                                            sport === "Swimming" ? "🏊 Natation" :
                                                                sport === "Weightlifting" ? "🏋️ Muscu" :
                                                                    sport === "Yoga" ? "🧘 Yoga" :
                                                                        sport === "Tennis" ? "🎾 Tennis" :
                                                                            sport === "Basketball" ? "🏀 Basket" :
                                                                                sport === "Soccer" ? "⚽ Foot" : sport}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Frequency */}
                        <FormField
                            control={form.control}
                            name="frequency"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-base font-semibold">📅 Tu bouges combien de fois ?</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                        >
                                            {[
                                                { val: "Rarely", label: "😴 Une fois par an (bonne conscience)" },
                                                { val: "Weekly", label: "📅 Le dimanche (c'est sacré)" },
                                                { val: "Bi-weekly", label: "💪 2-3 fois (je m'y mets)" },
                                                { val: "Daily", label: "🔥 Tous les jours (Machine !)" }
                                            ].map((item) => (
                                                <FormItem key={item.val} className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                                    <FormControl>
                                                        <RadioGroupItem value={item.val} />
                                                    </FormControl>
                                                    <FormLabel className="font-normal cursor-pointer flex-1">
                                                        {item.label}
                                                    </FormLabel>
                                                </FormItem>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Level */}
                        <FormField
                            control={form.control}
                            name="level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-semibold">⚡ Ton niveau de tryhard ?</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-12 text-base">
                                                <SelectValue placeholder="Sois honnête..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Beginner">👶 Débutant (Je découvre mes pieds)</SelectItem>
                                            <SelectItem value="Intermediate">😎 Intermédiaire (Je gère un peu)</SelectItem>
                                            <SelectItem value="Advanced">👽 Expert (Je suis une légende)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Goals */}
                        <FormField
                            control={form.control}
                            name="goals"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-semibold">🎯 Tes rêves de gloire ?</FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange([...field.value, val])}
                                        defaultValue={field.value?.[0]}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="h-12 text-base">
                                                <SelectValue placeholder="Que veux-tu accomplir ?" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Lose weight">⚖️ Perdre du gras</SelectItem>
                                            <SelectItem value="Build muscle">💪 Devenir énorme (et sec)</SelectItem>
                                            <SelectItem value="Improve endurance">🏃 Courir sans mourir</SelectItem>
                                            <SelectItem value="Health">❤️ Juste rester en vie</SelectItem>
                                            <SelectItem value="Competition">🏆 Gagner des médailles</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        (On sait, tu veux tout, mais choisis-en un pour commencer 😉)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Budget */}
                        <FormField
                            control={form.control}
                            name="budget"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-semibold">💰 Ton budget (promis on juge pas)</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-12 text-base">
                                                <SelectValue placeholder="Combien tu lâches ?" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Low">💸 Étudiant fauché (Low)</SelectItem>
                                            <SelectItem value="Medium">💳 Raisonnable (Medium)</SelectItem>
                                            <SelectItem value="High">🤑 Rotschild (High)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Health & Posture Section */}
                        <div className="space-y-6 pt-6 border-t-2 border-dashed border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">🚑</span>
                                <h3 className="text-xl font-bold text-primary">Bobologie & Posture de crevette</h3>
                            </div>

                            {/* Medical Conditions */}
                            <FormField
                                control={form.control}
                                name="medical_conditions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">🩹 Des petits pépins ? (Optionnel)</FormLabel>
                                        <FormControl>
                                            <input
                                                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:border-primary"
                                                placeholder="Genou en carton, cheville fragile..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Posture Rating */}
                            <FormField
                                control={form.control}
                                name="posture_rating"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">🦐 Ta posture devant l'ordi ?</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12 text-base">
                                                    <SelectValue placeholder="Note ta courbure..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="1">🦐 Crevette absolue (1/5)</SelectItem>
                                                <SelectItem value="2">🐢 Tortue ninja (2/5)</SelectItem>
                                                <SelectItem value="3">😐 Bof, ça passe (3/5)</SelectItem>
                                                <SelectItem value="4">📏 Assez droit (4/5)</SelectItem>
                                                <SelectItem value="5">💂 Soldat de la garde (5/5)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Back Pain */}
                            <FormField
                                control={form.control}
                                name="back_pain"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">💥 Le dos, ça tire ?</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12 text-base">
                                                    <SelectValue placeholder="Aïe ou pas aïe ?" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="None">🦸‍♂️ Jamais (Iron Man)</SelectItem>
                                                <SelectItem value="Occasional">🤔 Parfois (après le sport)</SelectItem>
                                                <SelectItem value="Frequent">🤕 Souvent (vieux avant l'âge)</SelectItem>
                                                <SelectItem value="Chronic">💀 Tout le temps (Aidez-moi)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Sedentary Level */}
                            <FormField
                                control={form.control}
                                name="sedentary_level"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">🛋️ Niveau de Canapé (Temps assis)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12 text-base">
                                                    <SelectValue placeholder="La vérité..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Low">🏃 Je bouge tout le temps (Low)</SelectItem>
                                                <SelectItem value="Medium">💼 Bureau mais je me lève (Medium)</SelectItem>
                                                <SelectItem value="High">🗿 Je suis fusionné avec ma chaise (High)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-lg transform transition-all hover:scale-[1.02]">
                            🚀 Lancer l'analyse cosmique
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
