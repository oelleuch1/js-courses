interface Notifier {
  send(userId: string, message: string): void;
}

class EmailNotifier implements Notifier {
  send(userId: string, message: string): void {
    console.log(`email -> ${userId}: ${message}`);
  }
}

class SmsNotifier implements Notifier {
  send(userId: string, message: string): void {
    console.log(`sms -> ${userId}: ${message}`);
  }
}

async function sendCampaign(notifier: Notifier, users: string[], msg: string) {
  for (const user of users) {
    notifier.send(user, msg);
  }
}

const emailNotifier = new EmailNotifier();
const smsNotifier = new SmsNotifier();

// sendCampaign(emailNotifier, ['Bob', 'Alice'], 'A new compaign message');
sendCampaign(smsNotifier, ['Bob', 'Alice'], 'A new compaign message');


/** 

interface PaymentProcessor {
  pay(orderId: string, amount: number): Promise<boolean>;
}

class StripePayment implements PaymentProcessor {
    async pay(orderId: string, amount: number): Promise<boolean> {
      console.log(`${orderId} is paid by strip for the amout of ${amount}`);
      return true;
    }
}

class BankPayment implements PaymentProcessor {
    async pay(orderId: string, amount: number): Promise<boolean> {
      console.log(`${orderId} is paid by direct bank transfert for the amout of ${amount}`);
      return true;
    }
}


class CheckoutService {
  constructor(private readonly processor: PaymentProcessor) {}

  checkout(orderId: string, amount: number): Promise<boolean> {
    return this.processor.pay(orderId, amount);
  }
}

const stripePayment = new StripePayment();
const bankPayment = new BankPayment();

const checkoutWithStripeService = new CheckoutService(stripePayment);
const checkoutWithBankPayment = new CheckoutService(bankPayment);

*/