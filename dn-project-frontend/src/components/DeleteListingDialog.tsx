import { deleteListing } from "@/services/services";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle } from "./ui/alert-dialog"
import { toast } from "sonner";

type DeleteListingDialogProps = {
    listingId: number | null;
    open: boolean;
    setOpen: (open: boolean) => void;
    onDelete?: () => void;
}

export const DeleteListingDialog = ({ listingId, open, setOpen, onDelete }: DeleteListingDialogProps) => {
    const handleDelete = async () => {
        if (!listingId) return;
        try {
            await deleteListing(listingId);
            toast.success("Anúncio excluído com sucesso!");
            onDelete?.(); 
            setOpen(false);
        } catch (error) {
            console.error("Error deleting listing:", error);
            toast.error("Falha ao excluir o anúncio. Por favor, tente novamente mais tarde.");
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogTitle className="text-lg font-bold">Tem certeza que deseja excluir este anúncio?</AlertDialogTitle>
                <AlertDialogDescription>Esta ação não pode ser desfeita. Todos os dados relacionados a este anúncio serão permanentemente excluídos.</AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}