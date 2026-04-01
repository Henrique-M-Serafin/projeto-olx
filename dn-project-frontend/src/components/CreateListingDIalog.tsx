'use client'

import { Dialog, DialogDescription, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { PlusSquareIcon } from "lucide-react";
import { useState } from "react";
import { createListing } from "@/services/services";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { LoginDialog } from "./LoginDialog";

interface CreateListingDialogProps {
    classname?: string;
}

export const CreateListingDialog = ({ classname }: CreateListingDialogProps) => {
    const [photos, setPhotos] = useState<File[]>([]);
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);
    const [form, setForm] = useState({
        title: "",
        listing_type: "",
        price: "",
        description: "",
        brand: "",
        model: "",
        year: "",
        mileage: "",
        color: "",
        fuel_type: "",
        transmission: "",
        condition: "",
    });

    const fuelLabels: Record<string, string> = {
        FLEX: "Flex",
        GASOLINE: "Gasolina",
        DIESEL: "Diesel",
        ELECTRIC: "Elétrico",
    };

    const transmissionLabels: Record<string, string> = {
        MANUAL: "Manual",
        AUTOMATIC: "Automático",
    };

    const conditionLabels: Record<string, string> = {
        NEW: "Novo",
        USED: "Usado",
    };

    const typeLabels: Record<string, string> = {
        car: "Carro",
        motorcycle: "Moto",
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setPhotos(Array.from(e.target.files));
        }
    };

    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        if (!user) {
            toast.error("Faça login para criar um anúncio.");
            setOpenLogin(true);
        } else {
            setOpen(true);
        }
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            formData.append(key, value);
        });

        photos.forEach((photo) => {
            formData.append("photos", photo);
        });

        try {
            await createListing(formData);
            toast.success("Anúncio criado com sucesso!");
            setOpen(false);
        } catch (error) {
            toast.error("Erro ao criar anúncio. Tente novamente.");
            console.error('Error creating listing:', error);
        } finally {
            setLoading(false);
        }
};
    return (
        <>
        <LoginDialog open={openLogin} onOpenChange={setOpenLogin} />
        <Dialog  open={open} onOpenChange={setOpen}>
            <button
                type="button"
                onClick={handleClick}
                className={` ${classname} rounded-xl cursor-pointer px-4 py-3 text-md bg-secondary text-secondary-foreground flex items-center gap-2 hover:bg-secondary/80 whitespace-nowrap `}
            >
                <PlusSquareIcon size={18} /> Criar Anúncio
            </button>
            <DialogContent className="max-w-lg font-space">
                <DialogHeader>
                    <DialogTitle className={""}>Criar Anúncio</DialogTitle>
                    <DialogDescription>Preencha os detalhes do veículo para criar seu anúncio.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <Input
                        placeholder="Título do anúncio"
                        value={form.title}
                        onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                    />
                    <div className="flex gap-2">
                        <Select onValueChange={(value) => setForm(prev => ({ ...prev, listing_type: value as string }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Tipo de veículo">
                                    {form.listing_type ? typeLabels[form.listing_type] : null}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="car">Carro</SelectItem>
                                <SelectItem value="motorcycle">Moto</SelectItem>
                            </SelectContent>
                        </Select>

                        <Input
                            type="number"
                            placeholder="Valor (R$)"
                            value={form.price}
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
                            required
                        />
                    </div>
                    <Textarea
                        placeholder="Descrição do anúncio"
                        rows={4}
                        value={form.description}
                        onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                        required
                    />

                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            placeholder="Marca"
                            value={form.brand}
                            onChange={(e) => setForm(prev => ({ ...prev, brand: e.target.value }))}
                        />
                        <Input
                            placeholder="Modelo"
                            value={form.model}
                            onChange={(e) => setForm(prev => ({ ...prev, model: e.target.value }))}
                        />
                        <Input
                            type="number"
                            placeholder="Ano"
                            value={form.year}
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            onChange={(e) => setForm(prev => ({ ...prev, year: e.target.value }))}
                        />
                        <Input
                            type="number"
                            placeholder="Quilometragem"
                            value={form.mileage}
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            onChange={(e) => setForm(prev => ({ ...prev, mileage: e.target.value }))}
                        />
                        <Input
                            placeholder="Cor"
                            value={form.color}
                            onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))}
                        />
                        <Select onValueChange={(value) => setForm(prev => ({ ...prev, fuel_type: value as string }))}>
                            <SelectTrigger className={"w-full"}>
                                <SelectValue placeholder="Combustível">
                                    {form.fuel_type ? fuelLabels[form.fuel_type] : null}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="FLEX">Flex</SelectItem>
                                <SelectItem value="GASOLINE">Gasolina</SelectItem>
                                <SelectItem value="DIESEL">Diesel</SelectItem>
                                <SelectItem value="ELECTRIC">Elétrico</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select onValueChange={(value) => setForm(prev => ({ ...prev, transmission: value as string }))}>
                            <SelectTrigger className={"w-full"}>
                                <SelectValue placeholder="Câmbio">
                                    {form.transmission ? transmissionLabels[form.transmission] : null}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MANUAL">Manual</SelectItem>
                                <SelectItem value="AUTOMATIC">Automático</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select onValueChange={(value) => setForm(prev => ({ ...prev, condition: value as string }))}>
                            <SelectTrigger className={"w-full"}>
                                <SelectValue placeholder="Condição">
                                    {form.condition ? conditionLabels[form.condition] : null}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NEW">Novo</SelectItem>
                                <SelectItem value="USED">Usado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-muted-foreground">Fotos do veículo</label>
                        <Input type="file" accept="image/*" multiple onChange={handlePhotoChange} />
                        {photos.length > 0 && (
                            <span className="text-sm text-muted-foreground">{photos.length} foto(s) selecionada(s)</span>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Publicando..." : "Publicar Anúncio"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
        </>
    );
};