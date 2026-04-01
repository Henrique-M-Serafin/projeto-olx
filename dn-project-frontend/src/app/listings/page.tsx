'use client'

import { CreateListingDialog } from "@/components/CreateListingDIalog";
import { DeleteListingDialog } from "@/components/DeleteListingDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { getListingByUser } from "@/services/services";
import { Listing } from "@/types";
import { ToastTitle } from "@base-ui/react";
import { Delete, FormInput, Newspaper, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ListingPage = () => {
    const { user } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [deletingListing, setDeletingListingId] = useState<number | null>(null);
    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await getListingByUser();
                setListings(response);
                toast.success("Anúncios carregados com sucesso!");
            }
            catch (error) {
                console.error("Error fetching listings:", error);
                toast.error("Falha ao carregar os anúncios. Por favor, tente novamente mais tarde.")
            }
        };
        fetchListings();
    }, []);

    return (
        <main className="px-16 h-full ">
            <h2 className="text-xl font-bold mb-2">Olá, <span className="text-primary">{user?.first_name || 'usuário'}!</span> Estes são os seus anúncios publicados:</h2>
            <Separator />
            <DeleteListingDialog listingId={deletingListing} open={deleteDialogOpen} setOpen={setDeleteDialogOpen}
                onDelete={() => {
                    setListings(prev => prev.filter(l => l.ID !== deletingListing));
                    setDeletingListingId(null);
                }} />
            {listings.length > 0 ? (
                <Carousel
                    opts={{
                        align: "center",
                        loop: true,
                    }}
                    className="w-full px-16"
                >
                    <CarouselContent>

                        {listings.map((listing: Listing) => (
                            <CarouselItem key={listing.ID} className="mt-4 basis-1/3">
                                <Link href={`/anuncios/${listing.ID}`}>
                                    <Card className="w-full">
                                        <CardHeader className="flex justify-between">
                                            <div className="flex flex-col gap-1">
                                                <CardTitle>{listing.title} </CardTitle>
                                                <CardDescription>{listing.description}</CardDescription>
                                            </div>
                                            <div className="flex  gap-1">
                                                <Button variant={"default"}
                                                    onClick={(e) => { e.preventDefault(); }}
                                                ><Pencil /></Button>
                                                <Button variant={"destructive"} onClick={(e) => {
                                                    e.preventDefault();
                                                    setDeletingListingId(listing.ID);
                                                    setDeleteDialogOpen(true);
                                                }}>
                                                    <Trash />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <Carousel>
                                                <CarouselContent>
                                                    {listing.listing_photos && listing.listing_photos.length > 0 ? (
                                                        listing.listing_photos.map((photo, index) => (
                                                            <CarouselItem key={index} className="w-full">
                                                                <div className="relative w-full h-48">
                                                                <Image
                                                                    src={photo.url}
                                                                    alt={`Foto do anúncio ${listing.title}`}
                                                                    fill
                                                                    className="object-cover rounded-lg"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).src = '/fallback-image-error.jpg';
                                                                        (e.target as HTMLImageElement).srcset = ''; // 👈 isso que faltava
                                                                    }}
                                                                />
                                                                </div>
                                                            </CarouselItem>
                                                        ))
                                                    ) : (
                                                        <CarouselItem className="w-full">
                                                            <div className="relative  w-full h-42">
                                                            <Image
                                                                src='/fallback-image-error.jpg'
                                                                alt="Sem fotos disponíveis"
                                                                fill
                                                                className="object-cover rounded-lg"
                                                            />
                                                            </div>
                                                            <p className="text-center text-sm text-muted-foregroud mt-1 ">Sem fotos disponíveis</p>
                                                            
                                                        </CarouselItem>
                                                    )}
                                                </CarouselContent>
                                                <CarouselPrevious />
                                                <CarouselNext />
                                            </Carousel>
                                        </CardContent>
                                        <CardFooter className="flex justify-around">
                                            <div className="flex flex-col gap-1">
                                                <p>Preço: ${listing.price.toFixed(2)}</p>
                                                <p>{new Date(listing.CreatedAt).toLocaleString('pt-BR')}</p>
                                            </div>

                                        </CardFooter>
                                    </Card>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-6" />
                    <CarouselNext className="right-6" />
                </Carousel>
            ) : (
                <div className=" items-center flex flex-col gap-2 justify-center h-full">
                    <Newspaper className="w-32 h-32 text-secondary" />
                    <h2 className="text-2xl font-space">Você ainda não publicou nenhum anúncio.</h2>
                    <CreateListingDialog classname="bg-primary text-primary-foreground" />
                </div>
            )}
        </main>
    )
}

export default ListingPage;