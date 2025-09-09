import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { Calendar, MapPin, Users } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard = ({ product, onSelect }: ProductCardProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Data a definir';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getStatusBadge = (status: Product['status']) => {
    const statusMap = {
      active: { label: 'Disponível', variant: 'default' as const },
      inactive: { label: 'Indisponível', variant: 'secondary' as const },
      sold_out: { label: 'Esgotado', variant: 'destructive' as const },
      upcoming: { label: 'Em Breve', variant: 'outline' as const }
    };
    
    return statusMap[status] || statusMap.active;
  };

  const statusBadge = getStatusBadge(product.status);
  const availability = product.max_quantity ? `${product.sold_quantity}/${product.max_quantity}` : 'Ilimitado';

  return (
    <Card className="h-full flex flex-col bg-card/50 backdrop-blur-sm border-white/10 hover:bg-card/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
      {product.image_url && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute top-2 right-2">
            <Badge variant={statusBadge.variant}>
              {statusBadge.label}
            </Badge>
          </div>
        </div>
      )}
      
      <CardHeader className="flex-1">
        <CardTitle className="text-xl text-foreground">{product.name}</CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-3">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(product.event_date)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Vendidos: {availability}</span>
        </div>

        <div className="text-2xl font-bold text-primary">
          {formatPrice(product.price)}
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          onClick={() => onSelect(product)}
          disabled={product.status !== 'active'}
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium"
        >
          {product.status === 'active' ? 'Comprar Agora' : 'Indisponível'}
        </Button>
      </CardFooter>
    </Card>
  );
};