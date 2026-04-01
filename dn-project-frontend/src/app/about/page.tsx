'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import ImagemPerfil from "../../../public/placeholder-image-profile.png"
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getListingByUser } from "@/services/services";
import { Listing } from "@/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";


const AboutPage = () => {
    const { user } = useAuth();
    const [userListings, setUserListings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getListingByUser();
                setUserListings(response);
            } catch (error) {
                console.error('Error fetching listings:', error);
            }
        };

        fetchData();
    }, [userListings.length]);

    return (
        <main className="px-12 py-4 h-4/5 max-h-4/5">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="text-lg uppercase font-space">Seu perfil</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 h-full">
                    <Card>
                        <CardContent className="h-full flex flex-col items-center gap-4">
                            <Image src={ImagemPerfil} alt="Imagem do perfil" width={180} height={180} className="rounded-full bg-background border-2 border-primary" />
                            <h2 className="text-xl font-bold">{user?.first_name} {user?.last_name}</h2>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                            <p className="text-sm text-muted-foreground">{user?.phone}</p>
                            <Button>Editar perfil</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between font-space">
                                Seus Anúncios Recentes 
                                <Link href="/listings">
                                    <Button
                                        variant={"secondary"}>
                                        Ver todos os anúncios
                                        <ArrowRight></ArrowRight>
                                    </Button>
                                </Link>
                            
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-full grid grid-cols-4 items-start gap-4 overflow-y-auto">
                            {userListings.length > 0 ? (
                                userListings.map((listing: Listing) => (
                                    <div key={listing.ID} className="relative rounded-xl overflow-hidden cursor-pointer group h-36">
                                        {listing.listing_photos?.[0]?.url && (
                                            <Image
                                                src={listing.listing_photos[0].url}
                                                alt={listing.title}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                            <p className="text-xs font-medium text-white truncate">{listing.title}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="col-span-4 text-center text-muted-foreground">Nenhuma listagem encontrada.</p>
                            )}
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </main>
    )
}

export default AboutPage