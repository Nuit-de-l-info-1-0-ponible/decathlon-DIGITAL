"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function ResultsPage() {
    const router = useRouter()
    const [profile, setProfile] = useState<any>(null)
    const [recommendations, setRecommendations] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const storedProfile = localStorage.getItem("userProfile")
        if (storedProfile) {
            const profileData = JSON.parse(storedProfile)
            setProfile(profileData)

            // Fetch recommendations
            fetch("http://localhost:8001/api/v1/recommend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(profileData),
            })
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch recommendations")
                    return res.json()
                })
                .then(data => {
                    setRecommendations(data)
                    setLoading(false)
                })
                .catch(err => {
                    console.error(err)
                    setError("Failed to load recommendations. Please try again.")
                    setLoading(false)
                })
        } else {
            router.push("/")
        }
    }, [router])

    if (loading) return <div className="flex min-h-screen items-center justify-center">Loading your personalized plan...</div>
    if (error) return <div className="flex min-h-screen items-center justify-center text-red-500">{error}</div>

    return (
        <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-slate-50 dark:bg-slate-950">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 text-center">
                Ton Plan Personnalisé 🚀
            </h1>

            {profile && recommendations && (
                <div className="grid grid-cols-1 gap-8 w-full max-w-6xl">

                    {/* Advice Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Coach's Advice */}
                        <Card className="bg-white dark:bg-slate-900 border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                    <span>🧘</span> Conseil du Coach
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                                    {recommendations.advice}
                                </p>
                            </CardContent>
                        </Card>

                        {/* External Advice (Infos du Web) */}
                        <Card className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-l-amber-500 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                    <span>💡</span> Infos du Web
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 italic">
                                    "{recommendations.external_advice}"
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Summary */}
                        <Card className="lg:col-span-1 h-fit shadow-md">
                            <CardHeader>
                                <CardTitle>Ton Profil</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-semibold text-slate-500">Sport</span>
                                    <span>{profile.sport}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-semibold text-slate-500">Niveau</span>
                                    <span>{profile.level}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-semibold text-slate-500">Objectif</span>
                                    <span className="text-right">{profile.goals.join(", ")}</span>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <span className="font-semibold text-slate-500">Fréquence</span>
                                    <span>{profile.frequency}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recommended Products */}
                        <Card className="lg:col-span-2 border-none shadow-none bg-transparent">
                            <CardHeader className="px-0 pt-0">
                                <CardTitle className="text-2xl">🎯 Équipements Recommandés</CardTitle>
                            </CardHeader>
                            <CardContent className="px-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {recommendations.products.map((product: any) => (
                                        <a
                                            key={product.id}
                                            href={product.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group block h-full"
                                        >
                                            <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 h-full flex flex-col">
                                                <div className="relative h-48 overflow-hidden bg-white">
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                                                        {(product.score * 100).toFixed(0)}% Match
                                                    </div>
                                                </div>
                                                <div className="p-5 flex flex-col flex-grow">
                                                    <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-3 flex-grow">
                                                        {product.description}
                                                    </p>
                                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                                        <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                                                            {product.price} €
                                                        </span>
                                                        <span className="text-sm font-medium text-blue-600 group-hover:underline">
                                                            Voir sur Decathlon →
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            <Button
                className="mt-12 bg-slate-900 text-white hover:bg-slate-800 px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all"
                onClick={() => router.push("/")}
            >
                🔄 Recommencer l'analyse
            </Button>
        </main>
    )
}
