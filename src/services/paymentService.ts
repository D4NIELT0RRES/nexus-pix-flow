import { PaymentData } from '@/types/product';

export class PaymentService {
  static generatePIXQRCode(data: PaymentData): string {
    // Simula geração de QR Code PIX
    const pixString = `PIX|${data.recipient}|${data.amount}|${data.description}`;
    return btoa(pixString); // Base64 encode para simular QR Code
  }

  static generatePIXCopyPaste(data: PaymentData): string {
    // Simula código PIX para copiar e colar
    return `00020126580014BR.GOV.BCB.PIX0136${data.recipient}52040000530398654${data.amount.replace('.', '')}5802BR5909${data.description}6008BRASILIA62070503***6304${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }

  static formatCurrency(value: string): string {
    const numericValue = value.replace(/\D/g, '');
    const numberValue = parseInt(numericValue, 10) / 100;
    
    if (isNaN(numberValue)) return '';
    
    return numberValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  static parseCurrencyToNumber(value: string): number {
    const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  }

  static validateAmount(amount: string): boolean {
    const numericValue = this.parseCurrencyToNumber(amount);
    return numericValue > 0 && numericValue <= 10000; // Limite de R$ 10.000
  }

  static validatePIXKey(key: string): boolean {
    // Validação básica de chave PIX
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?55\d{10,11}$/;
    const cpfRegex = /^\d{11}$/;
    const cnpjRegex = /^\d{14}$/;
    const randomKeyRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

    return emailRegex.test(key) || 
           phoneRegex.test(key.replace(/\D/g, '')) || 
           cpfRegex.test(key.replace(/\D/g, '')) ||
           cnpjRegex.test(key.replace(/\D/g, '')) ||
           randomKeyRegex.test(key);
  }
}