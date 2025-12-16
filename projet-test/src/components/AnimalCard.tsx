import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import URL_SERVER from '@/appApi';
import { useToast } from './ui/use-toast';

export const AnimalCard = ({ onSuccess }: { onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    code_animal: '',
    id_categorie: '',
    etat: 'disponible'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${URL_SERVER}/api/animaux`, formData);
      
      if (response.data.success) {
        toast({
          title: "Succès",
          description: "L'animal a été enregistré avec succès",
          variant: "default"
        });
        setFormData({ code_animal: '', id_categorie: '', etat: 'disponible' });
        onSuccess();
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-card rounded-lg border border-border">
      <h3 className="text-lg font-medium">Nouvel animal</h3>
      
      <div className="space-y-2">
        <Label htmlFor="code_animal">Code animal</Label>
        <Input
          id="code_animal"
          value={formData.code_animal}
          onChange={(e) => setFormData({...formData, code_animal: e.target.value})}
          placeholder="Ex: VACH-001"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Catégorie</Label>
        <Select 
          value={formData.id_categorie}
          onValueChange={(value) => setFormData({...formData, id_categorie: value})}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Vache</SelectItem>
            <SelectItem value="2">Mouton</SelectItem>
            <SelectItem value="3">Chèvre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>État</Label>
        <Select 
          value={formData.etat}
          onValueChange={(value) => setFormData({...formData, etat: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un état" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="disponible">Disponible</SelectItem>
            <SelectItem value="vendu">Vendu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Enregistrement...' : 'Enregistrer l\'animal'}
      </Button>
    </form>
  );
};