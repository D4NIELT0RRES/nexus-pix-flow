import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { QrCode, CreditCard, Smartphone, User, CheckCircle, ArrowLeft, Zap } from 'lucide-react';
import heroBackground from '@/assets/hero-bg.jpg';

type PaymentStep = 'recipient' | 'amount' | 'confirmation' | 'success';

interface PaymentData {
  recipientType: 'cpf' | 'phone' | 'email' | 'key';
  recipient: string;
  amount: string;
  description: string;
}

const PIXApp = () => {
  const [currentStep, setCurrentStep] = useState<PaymentStep>('recipient');
  const [paymentData, setPaymentData] = useState<PaymentData>({
    recipientType: 'cpf',
    recipient: '',
    amount: '',
    description: ''
  });

  const formatCurrency = (value: string) => {
    const numeric = value.replace(/\D/g, '');
    if (!numeric) return '';
    const amount = Number(numeric) / 100;
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleAmountChange = (value: string) => {
    const formatted = formatCurrency(value);
    setPaymentData(prev => ({ ...prev, amount: formatted }));
  };

  const getNumericAmount = () => {
    return paymentData.amount.replace(/\D/g, '');
  };

  const canProceedFromRecipient = () => {
    return paymentData.recipient.trim().length > 0;
  };

  const canProceedFromAmount = () => {
    return getNumericAmount() && Number(getNumericAmount()) > 0;
  };

  const RecipientStep = () => (
    <Card className="glass-card animate-slide-up">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Para quem você quer enviar?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="recipient-type" className="text-lg font-medium">
            Tipo de chave PIX
          </Label>
          <Select 
            value={paymentData.recipientType} 
            onValueChange={(value: 'cpf' | 'phone' | 'email' | 'key') => 
              setPaymentData(prev => ({ ...prev, recipientType: value, recipient: '' }))
            }
          >
            <SelectTrigger className="glass h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cpf">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  CPF
                </div>
              </SelectItem>
              <SelectItem value="phone">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Telefone
                </div>
              </SelectItem>
              <SelectItem value="email">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  E-mail
                </div>
              </SelectItem>
              <SelectItem value="key">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  Chave Aleatória
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipient" className="text-lg font-medium">
            {paymentData.recipientType === 'cpf' && 'CPF do destinatário'}
            {paymentData.recipientType === 'phone' && 'Telefone do destinatário'}
            {paymentData.recipientType === 'email' && 'E-mail do destinatário'}
            {paymentData.recipientType === 'key' && 'Chave PIX'}
          </Label>
          <Input
            id="recipient"
            placeholder={
              paymentData.recipientType === 'cpf' ? '000.000.000-00' :
              paymentData.recipientType === 'phone' ? '(11) 99999-9999' :
              paymentData.recipientType === 'email' ? 'usuario@email.com' :
              'Chave PIX aleatória'
            }
            value={paymentData.recipient}
            onChange={(e) => setPaymentData(prev => ({ ...prev, recipient: e.target.value }))}
            className="glass h-12 text-lg"
          />
        </div>

        <Button 
          className="w-full h-12 text-lg font-semibold bg-gradient-primary hover:shadow-lg transition-all duration-300"
          onClick={() => setCurrentStep('amount')}
          disabled={!canProceedFromRecipient()}
        >
          <Zap className="w-5 h-5 mr-2" />
          Continuar
        </Button>
      </CardContent>
    </Card>
  );

  const AmountStep = () => (
    <Card className="glass-card animate-slide-up">
      <CardHeader className="text-center">
        <Button
          variant="ghost"
          className="absolute left-4 top-4"
          onClick={() => setCurrentStep('recipient')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Qual o valor?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-lg font-medium">
            Valor a transferir
          </Label>
          <Input
            id="amount"
            placeholder="R$ 0,00"
            value={paymentData.amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="glass h-16 text-2xl text-center font-bold"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-lg font-medium">
            Descrição (opcional)
          </Label>
          <Input
            id="description"
            placeholder="Para que é essa transferência?"
            value={paymentData.description}
            onChange={(e) => setPaymentData(prev => ({ ...prev, description: e.target.value }))}
            className="glass h-12"
          />
        </div>

        <div className="glass rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Destinatário:</span>
            <span className="font-medium">{paymentData.recipient}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tipo:</span>
            <Badge variant="secondary" className="glass">
              {paymentData.recipientType.toUpperCase()}
            </Badge>
          </div>
        </div>

        <Button 
          className="w-full h-12 text-lg font-semibold bg-gradient-primary hover:shadow-lg transition-all duration-300"
          onClick={() => setCurrentStep('confirmation')}
          disabled={!canProceedFromAmount()}
        >
          Revisar Transferência
        </Button>
      </CardContent>
    </Card>
  );

  const ConfirmationStep = () => (
    <Card className="glass-card animate-slide-up">
      <CardHeader className="text-center">
        <Button
          variant="ghost"
          className="absolute left-4 top-4"
          onClick={() => setCurrentStep('amount')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Confirmar Transferência
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="glass rounded-lg p-6 space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {paymentData.amount}
            </div>
            <div className="text-muted-foreground">
              para {paymentData.recipient}
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tipo de chave:</span>
              <Badge variant="secondary" className="glass">
                {paymentData.recipientType.toUpperCase()}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Destinatário:</span>
              <span className="font-medium">{paymentData.recipient}</span>
            </div>
            {paymentData.description && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Descrição:</span>
                <span className="font-medium">{paymentData.description}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="glass rounded-2xl p-6 animate-pulse-glow">
            <QrCode className="w-32 h-32 mx-auto text-primary" />
            <p className="text-center text-sm text-muted-foreground mt-2">
              QR Code para pagamento
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline"
            className="glass h-12"
            onClick={() => setCurrentStep('amount')}
          >
            Voltar
          </Button>
          <Button 
            className="h-12 text-lg font-semibold bg-gradient-primary hover:shadow-lg transition-all duration-300"
            onClick={() => setCurrentStep('success')}
          >
            Confirmar PIX
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const SuccessStep = () => (
    <Card className="glass-card animate-slide-up text-center">
      <CardContent className="pt-8 space-y-6">
        <div className="mx-auto w-20 h-20 bg-success rounded-full flex items-center justify-center animate-pulse-glow">
          <CheckCircle className="w-12 h-12 text-success-foreground" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-success">
            PIX Realizado com Sucesso!
          </h2>
          <p className="text-muted-foreground">
            Sua transferência foi processada instantaneamente
          </p>
        </div>

        <div className="glass rounded-lg p-4 space-y-2">
          <div className="text-2xl font-bold text-primary">
            {paymentData.amount}
          </div>
          <div className="text-sm text-muted-foreground">
            enviado para {paymentData.recipient}
          </div>
        </div>

        <Button 
          className="w-full h-12 text-lg font-semibold bg-gradient-primary"
          onClick={() => {
            setCurrentStep('recipient');
            setPaymentData({
              recipientType: 'cpf',
              recipient: '',
              amount: '',
              description: ''
            });
          }}
        >
          Nova Transferência
        </Button>
      </CardContent>
    </Card>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 'recipient':
        return <RecipientStep />;
      case 'amount':
        return <AmountStep />;
      case 'confirmation':
        return <ConfirmationStep />;
      case 'success':
        return <SuccessStep />;
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            PIX Express
          </h1>
          <p className="text-muted-foreground">
            Transferências instantâneas e seguras
          </p>
        </div>
        
        {renderStep()}
      </div>
    </div>
  );
};

export default PIXApp;