import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Store, Plus } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from './ProductCard';
import { TicketPurchaseFlow } from './TicketPurchaseFlow';
import { Product } from '@/types/product';

const PIXApp = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products, loading, error } = useProducts();

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
  };

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
        <TicketPurchaseFlow 
          product={selectedProduct} 
          onBack={handleBackToProducts} 
        />
      </div>
    );
  }

  const renderProductsGrid = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-96 bg-card/50 backdrop-blur-sm border-white/10 animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg" />
              <div className="p-6 space-y-3">
                <div className="h-6 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-8 bg-muted rounded w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Card className="text-center p-8 bg-card/50 backdrop-blur-sm border-white/10">
          <p className="text-destructive mb-4">Erro ao carregar produtos: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </Card>
      );
    }

    if (products.length === 0) {
      return (
        <Card className="text-center p-8 bg-card/50 backdrop-blur-sm border-white/10">
          <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Nenhum produto disponível</h3>
          <p className="text-muted-foreground">
            Não há produtos ativos no momento. Volte em breve!
          </p>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={handleProductSelect}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-8 bg-card/50 backdrop-blur-sm border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
              <Store className="h-8 w-8" />
              Arena Transformados
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              Plataforma de venda de tickets para eventos gastronômicos
            </p>
          </CardHeader>
        </Card>

        {renderProductsGrid()}
      </div>
    </div>
  );
};

export default PIXApp;