export type Payment = {
  deeplink: string;
  message: string;
  orderId: string;
  partnerCode: string;
  payUrl: string;
  qrCodeUrl: string;
  requestId: string;
  responseTime: number;
  resultCode: number;
};

export type SepayCreateQrResponse = {
  qrImageUrl: string;
  accountNumber: string;
  amount: string;
  bankName: string;
  orderId: string;
};
