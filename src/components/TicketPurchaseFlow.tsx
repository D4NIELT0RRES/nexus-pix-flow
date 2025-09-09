import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, CreditCard, CheckCircle, Copy, QrCode } from 'lucide-react';
import { Product } from '@/types/product';
import { PaymentService } from '@/services/paymentService';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/components/ui/use-toast';

interface TicketPurchaseFlowProps {
  product: Product;
  onBack: () => void;
}

type Step = 'details' | 'payment' | 'success';

export const TicketPurchaseFlow = ({ product, onBack }: TicketPurchaseFlowProps) => {
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    quantity: 1,
    notes: ''
  });
  const [pixKey] = useState('contato@arenatransformados.com.br'); // Chave PIX da empresa
  const [orderId, setOrderId] = useState<string>('');
  
  const { createOrder, loading } = useOrders();
  const { toast } = useToast();

  const totalAmount = product.price * formData.quantity;

  const handleFormSubmit = async () => {
    try {
      const order = await createOrder({
        product_id: product.id,
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        customer_email: formData.customerEmail,
        quantity: formData.quantity,
        unit_price: product.price,
        total_amount: totalAmount,
        payment_status: 'pending',
        payment_method: 'pix',
        pix_key: pixKey,
        notes: formData.notes
      });

      setOrderId(order.id);
      setCurrentStep('payment');
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao processar pedido. Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  const copyPixCode = () => {
    const pixCode = PaymentService.generatePIXCopyPaste({
      recipientType: 'email',
      recipient: pixKey,
      amount: totalAmount.toString(),
      description: product.name
    });
    
    navigator.clipboard.writeText(pixCode);
    toast({
      title: 'Copiado!',
      description: 'Código PIX copiado para a área de transferência'
    });
  };

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customerName">Nome Completo *</Label>
          <Input
            id="customerName"
            value={formData.customerName}
            onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
            placeholder="Seu nome completo"
            required
          />
        </div>
        <div>
          <Label htmlFor="customerPhone">Telefone *</Label>
          <Input
            id="customerPhone"
            value={formData.customerPhone}
            onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
            placeholder="(11) 99999-9999"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="customerEmail">E-mail *</Label>
        <Input
          id="customerEmail"
          type="email"
          value={formData.customerEmail}
          onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
          placeholder="seu@email.com"
          required
        />
      </div>

      <div>
        <Label htmlFor="quantity">Quantidade</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          max={product.max_quantity || 10}
          value={formData.quantity}
          onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
        />
      </div>

      <div>
        <Label htmlFor="notes">Observações (opcional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Alguma observação especial?"
          rows={3}
        />
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Total:</span>
          <span className="text-2xl font-bold text-primary">
            {totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
      </div>

      <Button
        onClick={handleFormSubmit}
        disabled={!formData.customerName || !formData.customerPhone || !formData.customerEmail || loading}
        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
      >
        {loading ? 'Processando...' : 'Prosseguir para Pagamento'}
      </Button>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6 text-center">
      <div className="bg-primary/10 p-6 rounded-lg">
        <QrCode className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h3 className="text-xl font-semibold mb-2">Pagamento via PIX</h3>
        <p className="text-muted-foreground">
          Escaneie o QR Code ou copie o código para fazer o pagamento
        </p>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Valor:</strong> {totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          <p><strong>Chave PIX:</strong> {pixKey}</p>
          <p><strong>Pedido:</strong> #{orderId.slice(0, 8)}</p>
        </div>
      </div>

      <Button onClick={copyPixCode} variant="outline" className="w-full">
        <Copy className="mr-2 h-4 w-4" />
        Copiar Código PIX
      </Button>

      <Button
        onClick={() => setCurrentStep('success')}
        className="w-full bg-success hover:bg-success/90 text-white"
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        Pagamento Efetuado
      </Button>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="bg-success/10 p-6 rounded-lg">
        <CheckCircle className="h-16 w-16 mx-auto mb-4 text-success" />
        <h3 className="text-xl font-semibold mb-2 text-success">Pagamento Confirmado!</h3>
        <p className="text-muted-foreground">
          Seu pedido foi processado com sucesso
        </p>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg space-y-2">
        <div className="flex justify-between">
          <span>Pedido:</span>
          <span className="font-mono">#{orderId.slice(0, 8)}</span>
        </div>
        <div className="flex justify-between">
          <span>Produto:</span>
          <span>{product.name}</span>
        </div>
        <div className="flex justify-between">
          <span>Quantidade:</span>
          <span>{formData.quantity}x</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>{totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Você receberá mais informações por e-mail em breve.
      </p>

      <Button onClick={onBack} className="w-full">
        Fazer Outro Pedido
      </Button>
    </div>
  );

  return (
    <Card className="max-w-2xl mx-auto bg-card/80 backdrop-blur-sm border-white/10">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="flex items-center gap-2">
              {product.name}
              <Badge variant="outline" className="text-xs">
                {currentStep === 'details' ? 'Dados' : currentStep === 'payment' ? 'Pagamento' : 'Sucesso'}
              </Badge>
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4" />
              {product.event_date && new Date(product.event_date).toLocaleDateString('pt-BR')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {currentStep === 'details' && renderDetailsStep()}
        {currentStep === 'payment' && renderPaymentStep()}
        {currentStep === 'success' && renderSuccessStep()}
      </CardContent>
    </Card>
  );
};